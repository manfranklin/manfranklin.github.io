# frozen_string_literal: true

STDERR.puts "[ruby_3_compat] plugin loaded"

# Backport the old Ruby taint API for gems that still call it.
# Ruby 3+ removed Object#taint and Object#tainted?, but Jekyll/Liquid still expects them in some versions.
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
