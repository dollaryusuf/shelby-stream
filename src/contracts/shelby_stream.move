module shelby_stream::marketplace {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_FUNDS: u64 = 2;
    const E_CONTENT_NOT_FOUND: u64 = 3;

    struct PlatformConfig has key {
        admin: address,
        creator_share_bps: u64,         // 9500 = 95%
        treasury_share_bps: u64,         // 500 = 5%
        treasury_address: address,
    }

    struct ContentMetadata has key {
        creator: address,
        price_per_read: u64,
        blob_id: vector<u8>,
    }

    /**
     * Initialize the marketplace with the specified treasury address.
     * Sets the default revenue split: 95% Creator, 5% Treasury.
     */
    public entry fun initialize(
        admin: &signer, 
        treasury_address: address
    ) {
        let admin_addr = signer::address_of(admin);
        move_to(admin, PlatformConfig {
            admin: admin_addr,
            creator_share_bps: 9500,
            treasury_share_bps: 500,
            treasury_address,
        });
    }

    public entry fun register_content(
        creator: &signer,
        price_per_read: u64,
        blob_id: vector<u8>
    ) {
        move_to(creator, ContentMetadata {
            creator: signer::address_of(creator),
            price_per_read,
            blob_id,
        });
    }

    /**
     * Revenue Splitter: Accepts payment for a "Read" and distributes it.
     * 95% -> Content Creator
     * 5%  -> Shelby Stream Platform Treasury
     */
    public entry fun pay_for_read(
        user: &signer,
        creator_address: address
    ) acquires PlatformConfig, ContentMetadata {
        let content = borrow_global<ContentMetadata>(creator_address);
        let config = borrow_global<PlatformConfig>(@shelby_stream);
        
        let total_price = content.price_per_read;
        
        // Calculate shares
        let creator_share = (total_price * config.creator_share_bps) / 10000;
        let treasury_share = (total_price * config.treasury_share_bps) / 10000;

        // Transfer to Content Creator (95%)
        coin::transfer<AptosCoin>(user, content.creator, creator_share);
        
        // Transfer to Platform Treasury (5%)
        coin::transfer<AptosCoin>(user, config.treasury_address, treasury_share);
    }
}
