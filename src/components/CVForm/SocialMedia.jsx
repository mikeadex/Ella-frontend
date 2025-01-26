import { useState } from "react";
import { SOCIAL_MEDIA_PLATFORMS } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const SocialMedia = ({ data, updateData }) => {
  const [profiles, setProfiles] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const validateUrl = (url, pattern) => {
    if (!url) return true; // Empty URLs are valid
    try {
      new URL(url);
      return pattern ? new RegExp(pattern).test(url) : true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (platform, value) => {
    const platformConfig = SOCIAL_MEDIA_PLATFORMS.find(
      (p) => p.name === platform
    );
    
    setProfiles((prev) => ({
      ...prev,
      [platform]: value,
    }));

    // Update data without navigation when typing
    updateData({ ...profiles, [platform]: value }, false);

    if (value && !validateUrl(value, platformConfig?.pattern)) {
      setErrors((prev) => ({
        ...prev,
        [platform]: `Invalid ${platform} URL`,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[platform];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all URLs
    const newErrors = {};
    SOCIAL_MEDIA_PLATFORMS.forEach((platform) => {
      const url = profiles[platform.name];
      if (url && !validateUrl(url, platform.pattern)) {
        newErrors[platform.name] = `Invalid ${platform.name} URL`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        type: "error",
        message: "Please fix the invalid URLs before proceeding",
      });
      return;
    }

    // Format data for backend
    const formattedProfiles = Object.entries(profiles)
      .filter(([_, value]) => value?.trim())
      .map(([platform, url]) => ({
        platform,
        url: url.trim()
      }));

    updateData(formattedProfiles, true); // Allow navigation on final submit
    setNotification({
      type: "success",
      message: "Social media profiles saved successfully!",
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className={sharedStyles.card}>
          <div className={sharedStyles.cardHeader}>
            <h3 className="text-lg font-semibold">Social Media</h3>
          </div>

          <div className={sharedStyles.cardBody}>
            <p className="text-sm text-gray-600 mb-6">
              Add your social media profiles to enhance your CV. Leave fields empty
              for platforms you don't want to include.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                <div key={platform.name}>
                  <label htmlFor={platform.name} className="block text-sm font-medium text-gray-700">
                    {platform.name}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {platform.icon === "linkedin" && (
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.68 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        )}
                        {platform.icon === "github" && (
                          <path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.2-1.8-1.2-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.1-3.2-.1-.3-.5-1.5.1-3.2 0 0 .9-.3 3 1.1a10.5 10.5 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.7.2 2.9.1 3.2.7.8 1.1 1.9 1.1 3.2 0 4.6-2.8 5.6-5.4 5.9.4.3.7 1 .7 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 0z" />
                        )}
                        {platform.icon === "twitter" && (
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        )}
                        {platform.icon === "globe" && (
                          <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.85 5.943 2.072zm-8.228-1.22c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.816 8.061v-.398c3.735 0 7.034-.38 9.896-1.187.308.616.583 1.237.826 1.862-3.784 1.137-7.288 3.405-9.324 6.771-1.036-1.793-1.637-3.891-1.637-6.118zm4.304 7.403c1.798-3.203 5.082-5.32 8.549-6.4.418 1.162.755 2.346 1.007 3.55-2.984 1.181-4.965 3.818-5.894 7.08-1.474-.813-2.71-2.051-3.662-3.51zm6.534 4.201c.753-2.947 2.471-5.368 5.097-6.517.266 1.32.398 2.679.398 4.082 0 1.085-.147 2.116-.397 3.122-1.434.562-2.991.876-4.629.876-.517.001-1.028-.038-1.529-.114z" />
                        )}
                        {platform.icon === "behance" && (
                          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                        )}
                        {platform.icon === "dribbble" && (
                          <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.85 5.943 2.072zm-8.228-1.22c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.816 8.061v-.398c3.735 0 7.034-.38 9.896-1.187.308.616.583 1.237.826 1.862-3.784 1.137-7.288 3.405-9.324 6.771-1.036-1.793-1.637-3.891-1.637-6.118zm4.304 7.403c1.798-3.203 5.082-5.32 8.549-6.4.418 1.162.755 2.346 1.007 3.55-2.984 1.181-4.965 3.818-5.894 7.08-1.474-.813-2.71-2.051-3.662-3.51zm6.534 4.201c.753-2.947 2.471-5.368 5.097-6.517.266 1.32.398 2.679.398 4.082 0 1.085-.147 2.116-.397 3.122-1.434.562-2.991.876-4.629.876-.517.001-1.028-.038-1.529-.114z" />
                        )}
                      </svg>
                    </div>
                    <input
                      type="url"
                      id={platform.name}
                      value={profiles[platform.name] || ""}
                      onChange={(e) =>
                        handleUrlChange(platform.name, e.target.value)
                      }
                      placeholder={platform.placeholder}
                      className={`${sharedStyles.inputStyle} pl-10 ${
                        errors[platform.name] ? sharedStyles.errorBorder : ""
                      }`}
                    />
                  </div>
                  {errors[platform.name] && (
                    <p className={sharedStyles.error}>{errors[platform.name]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className={sharedStyles.buttonPrimary}
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialMedia;