class AddSecondaryMessageAndImageAndActiveToMessages < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :secondary_message, :string
    add_column :messages, :image_url, :string
    add_column :messages, :active, :boolean, default: false
  end
end
