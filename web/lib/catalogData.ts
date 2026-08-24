export type AppItem = {
  slug: string;
  name: string;
  description: string;
  category: string;
  version?: string;
  url?: string;
  sha256?: string;
};

export type CategoryData = {
  name: string;
  slug: string;
  apps: { slug: string; name: string; description: string }[];
};

const RAW_CATEGORIES: { name: string; apps: string[] }[] = [
  { name: "Web Browsers", apps: ["Chrome", "Firefox", "Edge", "Brave", "Vivaldi", "Opera", "Opera GX", "Tor Browser", "Arc", "Thorium"] },
  { name: "Messaging", apps: ["Zoom", "Discord", "Teams", "Slack", "Telegram", "Signal", "WhatsApp", "Skype", "Element", "Guilded"] },
  { name: "Media", apps: ["VLC", "Spotify", "iTunes", "OBS Studio", "DaVinci Resolve", "HandBrake", "AIMP", "Audacity", "MPC-HC", "K-Lite Codecs"] },
  { name: "Developer Tools", apps: ["VS Code", "Cursor", "Visual Studio 2022", "JetBrains Toolbox", "Docker Desktop", "GitHub Desktop", "Git", "Postman", "Windows Terminal", "Wireshark", "PuTTY", "Notepad++"] },
  { name: "Runtimes", apps: ["Java (JRE) 8", "Java (JDK) 21", ".NET Desktop Runtime 8.0", ".NET Desktop Runtime 6.0", "Python 3.12", "Node.js 22 Current", "Node.js 20 LTS"] },
  { name: "Adobe Creative Cloud", apps: ["Photoshop", "Illustrator", "Premiere Pro", "After Effects", "Lightroom", "InDesign", "Acrobat Pro"] },
  { name: "Imaging & Design", apps: ["Blender", "Figma", "Affinity Photo 2", "Affinity Designer 2", "Krita", "GIMP", "Paint.NET", "Inkscape", "ShareX", "Lightshot", "Capture One Pro", "CorelDRAW Graphics Suite"] },
  { name: "Documents & Notes", apps: ["Microsoft 365", "Adobe Acrobat Reader", "Foxit PDF Reader", "LibreOffice", "Notion", "Obsidian", "Evernote", "PDF Reader Pro"] },
  { name: "Download Managers", apps: ["4K Video Downloader Plus", "Any Video Downloader Pro", "Free YouTube Download", "Downie", "PullTube"] },
  { name: "Audio & Music", apps: ["Apple Logic Pro X", "FL Studio", "Ableton Live"] },
  { name: "Operating Systems", apps: ["Windows 11 Professional", "Windows Server 2025", "Windows Server 2022", "Ubuntu Desktop"] },
  { name: "Windows Utilities", apps: ["PowerToys", "Sysinternals Suite", "Rufus", "HWiNFO", "MSI Afterburner", "CrystalDiskInfo", "Revo Uninstaller", "WizTree", "Everything"] },
  { name: "Mac Essentials", apps: ["Alfred", "Raycast", "Homebrew", "iTerm2", "CleanMyMac X", "Magnet", "Rectangle"] },
  { name: "Gaming", apps: ["Steam", "Epic Games Launcher", "GOG Galaxy", "EA App", "Ubisoft Connect", "Riot Client"] },
  { name: "Security & Passwords", apps: ["Malwarebytes", "Bitdefender", "1Password", "Bitwarden", "KeePassXC"] },
  { name: "Online Storage", apps: ["Google Drive", "OneDrive", "Dropbox", "Nextcloud"] },
  { name: "Compression", apps: ["7-Zip", "WinRAR", "PeaZip", "Bandizip"] },
  { name: "File Sharing", apps: ["qBittorrent", "Transmission", "FileZilla", "WinSCP"] }
];

export const DEFAULT_CATEGORIES: CategoryData[] = RAW_CATEGORIES.map((cat) => {
  const catSlug = cat.name.toLowerCase().replace(/ /g, "-").replace(/&/g, "and");
  return {
    name: cat.name,
    slug: catSlug,
    apps: cat.apps.map((app) => ({
      name: app,
      slug: app.toLowerCase().replace(/ /g, "-").replace(/\./g, "-").replace(/[()]/g, ""),
      description: `${app} installation package.`
    }))
  };
});

export const ALL_APPS: AppItem[] = DEFAULT_CATEGORIES.flatMap((cat) =>
  cat.apps.map((app) => ({
    ...app,
    category: cat.name,
    version: "1.0.0",
    url: `https://example.com/downloads/${app.slug}.exe`,
    sha256: "0000000000000000000000000000000000000000000000000000000000000000"
  }))
);
