# frozen_string_literal: true

STDERR.puts "[ruby_3_compat] plugin loaded"

# Backport the legacy taint API for older gems that still expect it under Ruby 3+.
unless ''.respond_to?(:tainted?)
  class Object
    def taint
      self
    end

    def untaint
      self
    end

    def tainted?
      false
    end
  end
end
