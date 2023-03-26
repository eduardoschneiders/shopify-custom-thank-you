require 'rails_helper'
require 'mock_shopify_auth'


RSpec.describe "Messages", type: :request do
  before do
    allow(ShopifyAPI::Context).to receive(:host_scheme).and_return('https')
  end

  describe "#index" do
    before do
      Message.create(
        message: 'Some important message',
        secondary_message: 'some secondary message',
        created_at: created_at,
        image_url: 'http://image.jpg'
      )
    end

    let(:created_at) { Time.zone.now - 1.year}

    it 'lists all messages' do
      get api_messages_path
      expected_response = [
        {
          id: 1,
          message: 'Some important message',
          secondary_message: 'some secondary message',
          createdAt: created_at.to_s,
          image_url: 'http://image.jpg',
          active: false
        }
      ]

      response_body = JSON.parse(response.body, symbolize_names: true)
      expect(response_body).to eql(expected_response)
      expect(true).to eql(true)
    end
  end
end
