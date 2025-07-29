// src/composables/useSocialShare.js

import { useToast } from "vue-toastification";

export function useSocialShare(campaign) {
  const toast = useToast();

  const share = (url, width = 600, height = 400) => {
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    window.open(
      url,
      "Social Share",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  const shareToFacebook = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    share(shareUrl);
  };

  const shareToTwitter = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Bantu campaign: ${campaign.value.title}!`);
    const shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}`;
    share(shareUrl);
  };

  const shareToWhatsApp = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Bantu campaign: ${campaign.value.title}! Kunjungi link ini untuk berdonasi:\n`
    );
    const shareUrl = `https://api.whatsapp.com/send?text=${text}${pageUrl}`;
    share(shareUrl, 800, 600);
  };

  const shareToTelegram = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Bantu campaign: ${campaign.value.title}! Kunjungi link ini untuk berdonasi.`
    );
    const shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${text}`;
    share(shareUrl);
  };

  const shareToPinterest = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const description = encodeURIComponent(campaign.value.title);
    // Pastikan campaign memiliki gambar
    const media = campaign.value.image
      ? encodeURIComponent(campaign.value.image)
      : "";
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${media}&description=${description}`;
    share(shareUrl);
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Link berhasil disalin!");
      })
      .catch((err) => {
        toast.error("Gagal menyalin link.");
        console.error("Could not copy text: ", err);
      });
  };

  return {
    shareToFacebook,
    shareToTwitter,
    shareToWhatsApp,
    shareToTelegram,
    shareToPinterest,
    copyLink,
  };
}
