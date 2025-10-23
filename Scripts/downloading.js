/**
 * Download Progress Manager
 * Handles CV download with progress indication and sync animation
 */
class DownloadManager {
  constructor() {
    this.isDownloading = false;
    this.overlay = null;
    this.progressBar = null;
    this.progressText = null;
    this.syncIcon = null;
    this.contentDiv = null;

    this.init();
  }

  init() {
    this.createProgressOverlay();
    this.bindDownloadButtons();
    this.bindKeyboardEvents();
  }

  createProgressOverlay() {
    // Create overlay element
    this.overlay = document.createElement("div");
    this.overlay.className = "download-progress-overlay";
    this.overlay.setAttribute("role", "dialog");
    this.overlay.setAttribute("aria-labelledby", "download-title");
    this.overlay.setAttribute("aria-describedby", "download-description");

    // Create content container
    this.contentDiv = document.createElement("div");
    this.contentDiv.className = "download-progress-content";

    // Create content HTML with "Hi" message and security icons
    this.contentDiv.innerHTML = `
            <div class="greeting-container">
                <div class="greeting-icon">
                    <i class="fas fa-shield-alt"></i>
                    <i class="fas fa-biohazard"></i>
                </div>
                <h3 id="download-title">Hi there! <span class="wave">👋</span></h3>
                <p id="download-description">Securely downloading your CV...</p>
            </div>
            <div class="sync-icon">
                <i class="fas fa-sync-alt"></i>
            </div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            <div class="progress-text">Initializing secure connection...</div>
            <button class="close-progress" style="display: none;">Close</button>
        `;

    this.overlay.appendChild(this.contentDiv);
    document.body.appendChild(this.overlay);

    // Get references to elements
    this.progressBar = this.overlay.querySelector(".progress-bar");
    this.progressText = this.overlay.querySelector(".progress-text");
    this.syncIcon = this.overlay.querySelector(".sync-icon i");
    this.greetingContainer = this.overlay.querySelector(".greeting-container");

    // Bind close button
    const closeBtn = this.overlay.querySelector(".close-progress");
    closeBtn.addEventListener("click", () => this.hideProgress());

    // Close on overlay click
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.hideProgress();
      }
    });
  }

  bindDownloadButtons() {
    // Find all download buttons (CV download links)
    const downloadButtons = document.querySelectorAll(
      'a[href*=".pdf"], a[download], .cta-button[href*="cv"], .cta-button[href*="CV"]'
    );

    downloadButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const url = button.getAttribute("href");
        const filename = button.getAttribute("download") || "Amr_Khaled_CV.pdf";
        this.startDownload(url, filename, button);
      });
    });
  }

  bindKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.overlay.classList.contains("active")) {
        this.hideProgress();
      }
    });
  }

  async startDownload(url, filename, buttonElement) {
    if (this.isDownloading) return;

    this.isDownloading = true;

    // Add downloading state to button
    if (buttonElement) {
      buttonElement.classList.add("downloading");
      const icon = buttonElement.querySelector("i");
      if (icon) {
        icon.className = "fas fa-sync-alt";
      }
    }

    // Show progress overlay
    this.showProgress();

    try {
      // Simulate download progress steps
      await this.simulateDownloadProgress();

      // Actually start the download
      await this.downloadFile(url, filename);

      // Show success state
      this.showSuccess();

      // Show success notification
      this.showNotification(
        "Download Complete",
        "Your CV has been downloaded successfully!",
        "success"
      );
    } catch (error) {
      console.error("Download failed:", error);
      this.showError("Download failed. Please try again.");
      this.showNotification(
        "Download Failed",
        "There was an error downloading your CV.",
        "error"
      );
    } finally {
      // Reset button state
      if (buttonElement) {
        buttonElement.classList.remove("downloading");
        const icon = buttonElement.querySelector("i");
        if (icon) {
          icon.className = "fas fa-download";
        }
      }

      this.isDownloading = false;

      // Auto-hide after success/error
      setTimeout(() => {
        this.hideProgress();
      }, 3000);
    }
  }

  async simulateDownloadProgress() {
    const steps = [
      { progress: 0, text: "Initializing download..." },
      { progress: 20, text: "Connecting to server..." },
      { progress: 40, text: "Retrieving CV file..." },
      { progress: 60, text: "Processing document..." },
      { progress: 80, text: "Finalizing download..." },
      { progress: 95, text: "Almost ready..." },
    ];

    for (const step of steps) {
      await this.updateProgress(step.progress, step.text);
      await this.delay(300 + Math.random() * 200); // Random delay for realism
    }
  }

  async downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
      // Create a temporary link element for download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";

      // Handle download completion
      const handleDownload = () => {
        document.body.removeChild(link);
        resolve();
      };

      // Handle download error
      const handleError = () => {
        document.body.removeChild(link);
        reject(new Error("Download failed"));
      };

      // For external URLs, we can't detect completion reliably
      // So we'll simulate it
      document.body.appendChild(link);
      link.click();

      // Simulate download completion after a short delay
      setTimeout(handleDownload, 500);
    });
  }

  async updateProgress(percentage, text) {
    return new Promise((resolve) => {
      this.progressBar.style.width = `${percentage}%`;
      this.progressText.textContent = text;

      // Add a small delay for smooth animation
      setTimeout(resolve, 50);
    });
  }

  showProgress() {
    this.overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Add animation to greeting icons
    const shieldIcon = this.overlay.querySelector(".fa-shield-alt");
    const biohazardIcon = this.overlay.querySelector(".fa-biohazard");

    shieldIcon.style.animation = "shieldPulse 2s infinite";
    biohazardIcon.style.animation = "biohazardFloat 3s infinite";

    // Focus management for accessibility
    this.contentDiv.setAttribute("tabindex", "-1");
    this.contentDiv.focus();
  }

  hideProgress() {
    this.overlay.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling

    // Reset progress
    this.resetProgress();
  }

  resetProgress() {
    this.progressBar.style.width = "0%";
    this.progressText.textContent = "Initializing...";
    this.contentDiv.className = "download-progress-content";

    // Reset content
    const title = this.contentDiv.querySelector("h3");
    const description = this.contentDiv.querySelector("p");
    const closeBtn = this.contentDiv.querySelector(".close-progress");

    title.textContent = "Preparing Download";
    description.textContent = "Please wait while we prepare your CV...";
    closeBtn.style.display = "none";

    // Reset icon
    this.syncIcon.className = "fas fa-sync-alt";
  }

  showSuccess() {
    this.contentDiv.className = "download-progress-content download-success";
    this.progressBar.style.width = "100%";
    this.progressText.textContent = "Download completed successfully!";

    const title = this.contentDiv.querySelector("h3");
    const description = this.contentDiv.querySelector("p");
    const closeBtn = this.contentDiv.querySelector(".close-progress");

    title.textContent = "Download Complete";
    description.textContent = "Your CV has been downloaded successfully!";
    closeBtn.style.display = "inline-block";

    // Change icon to check
    this.syncIcon.className = "fas fa-check-circle";
  }

  showError(message) {
    this.contentDiv.className = "download-progress-content download-error";
    this.progressText.textContent = "Download failed";

    const title = this.contentDiv.querySelector("h3");
    const description = this.contentDiv.querySelector("p");
    const closeBtn = this.contentDiv.querySelector(".close-progress");

    title.textContent = "Download Failed";
    description.textContent =
      message || "There was an error downloading your CV. Please try again.";
    closeBtn.style.display = "inline-block";

    // Change icon to error
    this.syncIcon.className = "fas fa-times-circle";
  }

  showNotification(title, message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `download-notification ${type}`;

    const iconClass =
      type === "success" ? "fa-check-circle" : "fa-times-circle";
    const iconColor =
      type === "success" ? "var(--primary-color)" : "var(--secondary-color)";

    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}" style="color: ${iconColor};"></i>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto-hide notification
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize download manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DownloadManager();
});
// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = DownloadManager;
}

// this is for the initialize

// Initialization Loader
document.addEventListener("DOMContentLoaded", function () {
  const initOverlay = document.getElementById("initLoading");
  const progressBar = document.getElementById("initProgressBar");
  const loadingText = document.getElementById("initLoadingText");

  // Simulate initialization steps
  const steps = [
    { progress: 10, text: "Loading security modules..." },
    { progress: 25, text: "Initializing encryption..." },
    { progress: 40, text: "Verifying integrity..." },
    { progress: 60, text: "Establishing secure connection..." },
    { progress: 80, text: "Finalizing setup..." },
    { progress: 100, text: "Ready!" },
  ];

  let currentStep = 0;

  function updateProgress() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      progressBar.style.width = `${step.progress}%`;
      loadingText.textContent = step.text;
      currentStep++;

      // Random delay between steps for realism (300-800ms)
      const delay = 300 + Math.random() * 500;
      setTimeout(updateProgress, delay);
    } else {
      // When all steps are done, add loaded class to body
      document.body.classList.add("init-loaded");

      // Remove overlay after fade out
      setTimeout(() => {
        initOverlay.style.display = "none";
      }, 1000);
    }
  }

  // Start the progress
  setTimeout(updateProgress, 500);
});
