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
      Message.create(
        message: 'Other Message',
        secondary_message: 'some secondary message',
        created_at: created_at,
        image_url: 'http://image.jpg',
        active: true,

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
        },
        {
          id: 2,
          message: 'Other Message',
          secondary_message: 'some secondary message',
          createdAt: created_at.to_s,
          image_url: 'http://image.jpg',
          active: true
        },
      ]

      response_body = JSON.parse(response.body, symbolize_names: true)
      expect(response_body).to eql(expected_response)
    end
  end

  describe "#show" do
    before do
      Message.create(
        message: 'Some important message',
        secondary_message: 'some secondary message',
        created_at: created_at,
        image_url: 'http://image.jpg'
      )
    end

    let(:created_at) { Time.zone.now - 1.year}

    it 'lists the  messages' do
      get api_message_path(id: Message.first.id)
      expected_response ={
        id: Message.first.id,
        message: 'Some important message',
        secondary_message: 'some secondary message',
        createdAt: created_at.to_s,
        image_url: 'http://image.jpg',
        active: false
      }


      response_body = JSON.parse(response.body, symbolize_names: true)
      expect(response_body).to eql(expected_response)
    end
  end

  describe "#update" do
    before do
      Message.create(
        message: 'Some important message',
        secondary_message: 'some secondary message',
        created_at: created_at,
        image_url: 'http://image.jpg'
      )
    end

    let(:created_at) { Time.zone.now - 1.year}

    it 'lists the  messages' do
      patch api_message_path(id: Message.first.id, message: 'New Message')
      expected_response ={
        id: Message.first.id,
        message: 'New Message',
        secondary_message: 'some secondary message',
        createdAt: created_at.to_s,
        image_url: 'http://image.jpg',
        active: false
      }

      response_body = JSON.parse(response.body, symbolize_names: true)
      expect(response_body).to eql(expected_response)
    end
  end

  describe "#create" do
    before { Message.delete_all }

    it 'creates a message' do
      post api_messages_path(message: 'Some important message',
        secondary_message: 'some secondary message',
        image_url: 'http://image.jpg')

      expected_response ={
        id: 1,
        message: 'Some important message',
        secondary_message: 'some secondary message',
        createdAt: Time.zone.now.to_s,
        image_url: 'http://image.jpg',
        active: false
      }

      response_body = JSON.parse(response.body, symbolize_names: true)
      expect(response_body).to eql(expected_response)
      expect(Message.count).to eql(1)
    end
  end

  describe "#delete" do
    before do
      Message.create(
        message: 'Some important message',
        secondary_message: 'some secondary message',
        created_at: Time.zone.now,
        image_url: 'http://image.jpg'
      )
    end


    it 'lists the  messages' do
      delete api_message_path(id: Message.first.id)
      expect(Message.count).to eql(0)
    end
  end
end
