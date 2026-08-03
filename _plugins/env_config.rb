module Jekyll
  class EnvConfigGenerator < Generator
    safe true
    priority :lowest

    DEFAULTS = {
      'name' => 'Manuel Franklin',
      'description' => 'Personal website and portfolio of Manuel Franklin.',
      'url' => 'https://manfranklin.github.io',
      'baseurl' => '',
      'google_analytics' => '',
      'google_analytics_ga4' => '',
      'umami_enabled' => false
    }.freeze

    CONFIG_ALIASES = {
      'name' => %w[SITE_NAME],
      'author' => %w[SITE_AUTHOR],
      'description' => %w[SITE_DESCRIPTION],
      'url' => %w[SITE_URL],
      'baseurl' => %w[SITE_BASEURL],
      'google_analytics' => %w[GOOGLE_ANALYTICS],
      'google_analytics_ga4' => %w[GOOGLE_ANALYTICS_GA4],
      'umami_enabled' => %w[UMAMI_ENABLED],
      'enforce_ssl' => %w[SITE_ENFORCE_SSL]
    }.freeze

    def generate(site)
      merge_environment_values
      apply_site_defaults(site)
      site.config['author'] ||= site.config['name']
      site.config['enforce_ssl'] = env_or_config('enforce_ssl', site.config['enforce_ssl'], site.config['url'])
      configure_umami(site)
      configure_footer_links(site)
    end

    private

    def merge_environment_values
      # Merge the production environment file only when the build is running in a production context.
      return unless ENV['JEKYLL_ENV'] == 'production' || ENV['GITHUB_ACTIONS'] == 'true'

      env_path = File.expand_path('../.env.prod', __dir__)
      return unless File.exist?(env_path)

      parse_env_file(env_path).each do |key, value|
        ENV[key] = value unless ENV.key?(key)
      end
    end

    def apply_site_defaults(site)
      DEFAULTS.each do |config_key, fallback|
        site.config[config_key] = env_or_config(config_key, site.config[config_key], fallback)
      end
    end

    # Configure analytics settings from environment variables and the site config.
    def configure_umami(site)
      umami_value = site.config['UMAMI_CLIENT_ID'] || first_present(%w[UMAMI_CLIENT_ID]) || ''
      umami_domain_value = site.config['umami_domain'] || first_present(%w[UMAMI_DOMAIN]) || 'cloud.umami.is'
      umami_enabled = production_environment? && truthy?(site.config['umami_enabled'] || first_present(%w[UMAMI_ENABLED])) && !umami_value.empty?

      warn "[EnvConfigGenerator] umami_enabled=#{umami_enabled.inspect} umami_value=#{umami_value.inspect} umami_domain_value=#{umami_domain_value.inspect} JEKYLL_ENV=#{ENV['JEKYLL_ENV'].inspect} UMAMI_ENABLED=#{ENV['UMAMI_ENABLED'].inspect}"

      site.config['UMAMI_CLIENT_ID'] = umami_value
      site.config['umami_domain'] = umami_domain_value
      site.config['UMAMI_DOMAIN'] = umami_domain_value
      site.config['umami_enabled'] = umami_enabled
      site.config['UMAMI_ENABLED'] = umami_enabled
    end

    # Populate the footer links with environment-aware defaults when values are missing.
    def configure_footer_links(site)
      footer_links = site.config['footer-links'] || {}
      footer_links['email'] = ENV['SITE_EMAIL'] || footer_links['email'] || 'manfraklin817@gmail.com'
      footer_links['linkedin'] = ENV['SITE_LINKEDIN'] || footer_links['linkedin'] || 'https://www.linkedin.com/in/manfranklin/'
      site.config['footer-links'] = footer_links
    end

    def env_or_config(config_key, current_value, fallback)
      if current_value.nil? || current_value.to_s.strip.empty?
        first_present(CONFIG_ALIASES.fetch(config_key, [])) || fallback
      else
        current_value
      end
    end

    def production_environment?
      ENV['JEKYLL_ENV'].to_s.downcase == 'production' || ENV['GITHUB_ACTIONS'] == 'true'
    end

    def truthy?(value)
      return true if value == true
      return false if value.nil?

      value.to_s.strip.downcase == 'true'
    end

    def first_present(keys)
      keys.each do |key|
        value = ENV[key]
        return value if value && !value.strip.empty?
      end
      nil
    end

    def parse_env_file(path)
      return {} unless File.exist?(path)

      File.readlines(path, chomp: true).each_with_object({}) do |line, values|
        stripped = line.strip
        next if stripped.empty? || stripped.start_with?('#')

        key, value = parse_env_line(stripped)
        values[key] = value if key
      end
    end

    def parse_env_line(line)
      return unless line =~ /\A([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*(.*)\z/

      key = Regexp.last_match(1)
      value = Regexp.last_match(2).strip
      [key, unquote(value)]
    end

    def unquote(value)
      return value unless value.length >= 2
      return value[1...-1] if quoted_string?(value)
      value
    end

    def quoted_string?(value)
      (value.start_with?("\"") && value.end_with?("\"")) ||
        (value.start_with?("'") && value.end_with?("'"))
    end
  end
end
