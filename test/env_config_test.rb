require 'minitest/autorun'
require 'jekyll'
require_relative '../_plugins/env_config'

class EnvConfigGeneratorTest < Minitest::Test
  # Reset environment variables before each test so each case starts from a
  # known, isolated state.
  def setup
    ENV.delete('JEKYLL_ENV')
    ENV.delete('UMAMI_CLIENT_ID')
    ENV.delete('UMAMI_DOMAIN')
    ENV.delete('SITE_NAME')
    ENV.delete('SITE_AUTHOR')
    ENV.delete('SITE_DESCRIPTION')
    ENV.delete('SITE_URL')
    ENV.delete('SITE_BASEURL')
    ENV.delete('GOOGLE_ANALYTICS')
    ENV.delete('GOOGLE_ANALYTICS_GA4')
    ENV.delete('SITE_ENFORCE_SSL')
  end

  # Ensure Umami stays disabled when the site is not running in production.
  def test_umami_is_disabled_outside_production
    site = stub_site

    Jekyll::EnvConfigGenerator.new.generate(site)

    refute site.config['umami_enabled']
  end

  # Verify that Umami is enabled and configured correctly when production mode
  # and a client ID are provided.
  def test_umami_is_enabled_during_production_with_client_id
    ENV['JEKYLL_ENV'] = 'production'
    ENV['UMAMI_ENABLED'] = 'true'
    ENV['UMAMI_CLIENT_ID'] = '00000000-0000-0000-0000-000000000000'
    ENV['UMAMI_DOMAIN'] = 'cloud.umami.is'
    site = stub_site

    Jekyll::EnvConfigGenerator.new.generate(site)

    assert_equal '00000000-0000-0000-0000-000000000000', site.config['UMAMI_CLIENT_ID']
    assert_equal 'cloud.umami.is', site.config['umami_domain']
    assert site.config['umami_enabled']
  end

  private

  # Build a minimal site config object that mimics the shape expected by the
  # environment config generator during tests.
  def stub_site
    Struct.new(:config).new({
      'name' => 'Example',
      'description' => 'Example site',
      'url' => 'https://example.com',
      'baseurl' => '',
      'google_analytics' => '',
      'google_analytics_ga4' => '',
      'footer-links' => {}
    })
  end
end
