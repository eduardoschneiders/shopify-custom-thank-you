class Message < ApplicationRecord
  scope :active, -> { where(active: true) }
end
