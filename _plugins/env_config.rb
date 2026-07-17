module Jekyll
  class EnvConfigGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      env_file = File.expand_path('../.env.prod', __dir__)
      env_values = parse_env_file(env_file)

      env_values.each do |key, value|
        ENV[key] = value unless ENV.key?(key)
      end

      site.config['name'] = ENV['SITE_NAME'] || site.config['name'] || 'Manuel Franklin'
      site.config['author'] = ENV['SITE_AUTHOR'] || site.config['author'] || site.config['name']
      site.config['description'] = ENV['SITE_DESCRIPTION'] || site.config['description'] || 'Personal website and portfolio of Manuel Franklin.'
      site.config['url'] = ENV['SITE_URL'] || site.config['url'] || 'https://manfranklin.github.io'
      site.config['baseurl'] = ENV['SITE_BASEURL'] || site.config['baseurl'] || ''
      site.config['enforce_ssl'] = ENV['SITE_ENFORCE_SSL'] || site.config['enforce_ssl'] || site.config['url']
      site.config['google_analytics'] = ENV['GOOGLE_ANALYTICS'] || site.config['google_analytics'] || ''
      site.config['google_analytics_ga4'] = ENV['GOOGLE_ANALYTICS_GA4'] || site.config['google_analytics_ga4'] || ''
      site.config['umami_id'] = ENV['UMAMI_ID'] || ENV['UMAMI_CLIENT_ID'] || site.config['umami_id'] || ''
      site.config['umami_domain'] = ENV['UMAMI_DOMAIN'] || site.config['umami_domain'] || 'cloud.umami.is'
      site.config['tina_branch'] = ENV['TINA_BRANCH'] || site.config['tina_branch'] || 'main'
      site.config['tina_client_id'] = ENV['TINA_CLIENT_ID'] || site.config['tina_client_id'] || ''
      site.config['tina_token'] = ENV['TINA_TOKEN'] || ENV['TINA_TOKEN_CONTENT'] || ENV['TINA_TOKEN_SEARCH'] || site.config['tina_token'] || ''

      footer_links = site.config['footer-links'] || {}
      footer_links['email'] = ENV['SITE_EMAIL'] || footer_links['email'] || 'manfranklin817@gmail.com'
      footer_links['linkedin'] = ENV['SITE_LINKEDIN'] || footer_links['linkedin'] || 'https://www.linkedin.com/in/manfranklin/'
      site.config['footer-links'] = footer_links
    end

    private

    def parse_env_file(path)
      return {} unless File.exist?(path)

      File.readlines(path, chomp: true).each_with_object({}) do |line, values|
        stripped = line.strip
        next if stripped.empty? || stripped.start_with?('#')

        if stripped =~ /\A([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*(.*)\z/
          key = Regexp.last_match(1)
          value = Regexp.last_match(2).strip
          value = value[1...-1] if value.length >= 2 && ((value.start_with?('"') && value.end_with?('"')) || (value.start_with?("'") && value.end_with?("'")))
          values[key] = value
        end
      end
    end
  end
end
