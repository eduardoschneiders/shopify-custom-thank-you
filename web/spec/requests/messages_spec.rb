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

    it 'lists the message' do
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

    it 'updates the message' do
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


    it 'deletes a message' do
      delete api_message_path(id: Message.first.id)
      expect(Message.count).to eql(0)
    end
  end

  describe "#activate" do
    before do
      first_message
      second_message
      third_message
    end

    let(:first_message) do
      Message.create(
        message: 'Some important message',
        secondary_message: 'some secondary message',
        created_at: created_at,
        image_url: 'http://image.jpg',
        active: false
      )
    end

    let(:second_message) do
      Message.create(
        message: 'Other Message',
        secondary_message: 'some secondary message',
        created_at: created_at,
        image_url: 'http://image.jpg',
        active: true,
      )
    end

    let(:third_message) do
      Message.create(
        message: 'Other Message',
        secondary_message: 'some secondary message',
        created_at: created_at,
        image_url: 'http://image.jpg',
        active: false,
      )
    end

    let(:created_at) { Time.zone.now - 1.year}

    it 'activates a message, and deactivate the others' do
      post activate_api_message_path(id: Message.first.id)

      expect(first_message.reload.active).to be_truthy
      expect(second_message.reload.active).to be_falsey
      expect(third_message.reload.active).to be_falsey
    end
  end
end
