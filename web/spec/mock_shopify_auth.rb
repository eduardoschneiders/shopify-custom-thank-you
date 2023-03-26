module ShopifyApp
  module LoginProtection
    def activate_shopify_session
      yield
    end
  end
end