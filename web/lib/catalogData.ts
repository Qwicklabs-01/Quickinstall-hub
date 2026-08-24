export type AppItem = {
  slug: string;
  name: string;
  description: string;
  category: string;
  wingetId?: string;
  version?: string;
  url?: string;
  sha256?: string;
};

export type CategoryData = {
  name: string;
  slug: string;
  apps: { slug: string; name: string; description: string; wingetId?: string }[];
};

export const WINGET_MAP: Record<string, string> = {
  "chrome": "Google.Chrome",
  "firefox": "Mozilla.Firefox",
  "edge": "Microsoft.Edge",
  "brave": "Brave.Brave",
  "vivaldi": "VivaldiTechnologies.Vivaldi",
  "opera": "Opera.Opera",
  "opera-gx": "Opera.OperaGX",
  "tor-browser": "TorProject.TorBrowser",
  "arc": "TheBrowserCompany.Arc",
  "thorium": "Alex313031.Thorium",

  "zoom": "Zoom.Zoom",
  "discord": "Discord.Discord",
  "teams": "Microsoft.Teams",
  "slack": "SlackTechnologies.Slack",
  "telegram": "Telegram.TelegramDesktop",
  "signal": "OpenWhisperSystems.Signal",
  "whatsapp": "WhatsApp.WhatsApp",
  "skype": "Microsoft.Skype",
  "element": "Element.Element",
  "guilded": "Guilded.Guilded",

  "vlc": "VideoLAN.VLC",
  "spotify": "Spotify.Spotify",
  "itunes": "Apple.iTunes",
  "obs-studio": "OBSProject.OBSStudio",
  "davinci-resolve": "BlackmagicDesign.DaVinciResolve",
  "handbrake": "HandBrake.HandBrake",
  "aimp": "AIMP.AIMP",
  "audacity": "Audacity.Audacity",
  "mpc-hc": "clsid2.mpc-hc",
  "k-lite-codecs": "CodecGuide.K-LiteCodecPack.Standard",

  "vs-code": "Microsoft.VisualStudioCode",
  "cursor": "Anysphere.Cursor",
  "visual-studio-2022": "Microsoft.VisualStudio.2022.Community",
  "jetbrains-toolbox": "JetBrains.Toolbox",
  "docker-desktop": "Docker.DockerDesktop",
  "github-desktop": "GitHub.GitHubDesktop",
  "git": "Git.Git",
  "postman": "Postman.Postman",
  "windows-terminal": "Microsoft.WindowsTerminal",
  "wireshark": "WiresharkFoundation.Wireshark",
  "putty": "PuTTY.PuTTY",
  "notepad++": "Notepad++.Notepad++",

  "java-jre-8": "Oracle.JavaRuntimeEnvironment",
  "java-jdk-21": "Oracle.JDK.21",
  "net-desktop-runtime-8-0": "Microsoft.DotNet.DesktopRuntime.8",
  "net-desktop-runtime-6-0": "Microsoft.DotNet.DesktopRuntime.6",
  "python-3-12": "Python.Python.3.12",
  "node-js-22-current": "OpenJS.NodeJS",
  "node-js-20-lts": "OpenJS.NodeJS.LTS",

  "photoshop": "Adobe.Photoshop",
  "illustrator": "Adobe.Illustrator",
  "premiere-pro": "Adobe.PremierePro",
  "after-effects": "Adobe.AfterEffects",
  "lightroom": "Adobe.Lightroom",
  "indesign": "Adobe.InDesign",
  "acrobat-pro": "Adobe.Acrobat.Pro.64-bit",

  "blender": "BlenderFoundation.Blender",
  "figma": "Figma.Figma",
  "affinity-photo-2": "Serif.AffinityPhoto.2",
  "affinity-designer-2": "Serif.AffinityDesigner.2",
  "krita": "KDE.Krita",
  "gimp": "GIMP.GIMP",
  "paint-net": "dotPDN.PaintDotNet",
  "inkscape": "Inkscape.Inkscape",
  "sharex": "ShareX.ShareX",
  "lightshot": "Skillbrains.Lightshot",
  "capture-one-pro": "PhaseOne.CaptureOnePro",
  "coreldraw-graphics-suite": "Corel.CorelDRAWGraphicsSuite",

  "microsoft-365": "Microsoft.Office",
  "adobe-acrobat-reader": "Adobe.Acrobat.Reader.64-bit",
  "foxit-pdf-reader": "Foxit.FoxitReader",
  "libreoffice": "TheDocumentFoundation.LibreOffice",
  "notion": "Notion.Notion",
  "obsidian": "Obsidian.Obsidian",
  "evernote": "Evernote.Evernote",
  "pdf-reader-pro": "PDFReaderPro.PDFReaderPro",

  "4k-video-downloader-plus": "OpenMedia.4KVideoDownloaderPlus",
  "any-video-downloader-pro": "AnyVideoDownloader.AnyVideoDownloaderPro",
  "free-youtube-download": "DVDVideoSoft.FreeYouTubeDownload",
  "downie": "CharlieMonroe.Downie",
  "pulltube": "MyMixApps.PullTube",

  "apple-logic-pro-x": "Apple.LogicProX",
  "fl-studio": "ImageLine.FLStudio",
  "ableton-live": "Ableton.LiveSuite",

  "windows-11-professional": "Microsoft.Windows11",
  "windows-server-2025": "Microsoft.WindowsServer2025",
  "windows-server-2022": "Microsoft.WindowsServer2022",
  "ubuntu-desktop": "Canonical.Ubuntu",

  "powertoys": "Microsoft.PowerToys",
  "sysinternals-suite": "Microsoft.SysinternalsSuite",
  "rufus": "Rufus.Rufus",
  "hwinfo": "REALiX.HWiNFO",
  "msi-afterburner": "Guru3D.Afterburner",
  "crystaldiskinfo": "CrystalDewWorld.CrystalDiskInfo",
  "revo-uninstaller": "RevoUninstaller.RevoUninstaller",
  "wiztree": "AntibodySoftware.WizTree",
  "everything": "voidtools.Everything",

  "alfred": "RunningWithCrayons.Alfred",
  "raycast": "Raycast.Raycast",
  "homebrew": "Homebrew.Homebrew",
  "iterm2": "iTerm2.iTerm2",
  "cleanmymac-x": "MacPaw.CleanMyMacX",
  "magnet": "CrowdCafe.Magnet",
  "rectangle": "Knollsoft.Rectangle",

  "steam": "Valve.Steam",
  "epic-games-launcher": "EpicGames.EpicGamesLauncher",
  "gog-galaxy": "GOG.Galaxy",
  "ea-app": "ElectronicArts.EADesktop",
  "ubisoft-connect": "Ubisoft.Connect",
  "riot-client": "RiotGames.RiotClient",

  "malwarebytes": "Malwarebytes.Malwarebytes",
  "bitdefender": "Bitdefender.Bitdefender",
  "1password": "AgileBits.1Password",
  "bitwarden": "Bitwarden.Bitwarden",
  "keepassxc": "KeePassXCTeam.KeePassXC",

  "google-drive": "Google.GoogleDrive",
  "onedrive": "Microsoft.OneDrive",
  "dropbox": "Dropbox.Dropbox",
  "nextcloud": "Nextcloud.NextcloudDesktop",

  "7-zip": "7zip.7zip",
  "winrar": "RARLab.WinRAR",
  "peazip": "GiorgioTani.PeaZip",
  "bandizip": "Bandisoft.Bandizip",

  "qbittorrent": "qBittorrent.qBittorrent",
  "transmission": "Transmission.Transmission",
  "filezilla": "TimKosse.FileZilla.Client",
  "winscp": "WinSCP.WinSCP"
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
    apps: cat.apps.map((app) => {
      const slug = app.toLowerCase().replace(/ /g, "-").replace(/\./g, "-").replace(/[()]/g, "");
      return {
        name: app,
        slug: slug,
        wingetId: WINGET_MAP[slug] || undefined,
        description: `${app} installation package.`
      };
    })
  };
});

export const ALL_APPS: AppItem[] = DEFAULT_CATEGORIES.flatMap((cat) =>
  cat.apps.map((app) => ({
    ...app,
    category: cat.name,
    wingetId: app.wingetId || WINGET_MAP[app.slug],
    version: "1.0.0",
    url: `https://example.com/downloads/${app.slug}.exe`,
    sha256: "0000000000000000000000000000000000000000000000000000000000000000"
  }))
);

// Generates a self-contained 1-Click Windows Batch Installer (.bat)
export function generateBatchScript(selectedApps: { slug: string; name: string }[]): string {
  const lines: string[] = [
    "@echo off",
    "chcp 65001 >nul",
    "title QuickInstall Hub - Windows App Suite Installer",
    "color 0b",
    "cls",
    "echo ======================================================================",
    "echo                     QuickInstall Hub - Windows Installer               ",
    "echo ======================================================================",
    "echo.",
    `echo  Selected Apps (${selectedApps.length}):`,
    ...selectedApps.map((a) => `echo   - ${a.name}`),
    "echo.",
    "echo ----------------------------------------------------------------------",
    "echo  [1/2] Verifying Windows Package Manager (winget)...",
    "where winget >nul 2>nul",
    "if %errorlevel% neq 0 (",
    "    echo [!] winget is not installed on this system.",
    "    echo [!] Opening Microsoft Winget download page in your browser...",
    "    start https://aka.ms/getwinget",
    "    echo Please install the App Installer from Microsoft Store and re-run this script.",
    "    pause",
    "    exit /b 1",
    ")",
    "echo  [OK] winget detected.",
    "echo.",
    "echo  [2/2] Starting silent installation of your applications...",
    "echo ----------------------------------------------------------------------",
    "echo."
  ];

  selectedApps.forEach((app, index) => {
    const wingetId = WINGET_MAP[app.slug] || app.name;
    lines.push(
      `echo [${index + 1}/${selectedApps.length}] Installing ${app.name}...`,
      `winget install --id "${wingetId}" -e --silent --accept-source-agreements --accept-package-agreements`,
      `if %errorlevel% equ 0 (`,
      `    echo   [✓] ${app.name} installed successfully.`,
      `) else (`,
      `    echo   [!] Note: ${app.name} finished with status code %errorlevel%.`,
      `)`,
      "echo."
    );
  });

  lines.push(
    "echo ======================================================================",
    "echo  [SUCCESS] All selected applications processed!",
    "echo ======================================================================",
    "echo.",
    "pause"
  );

  return lines.join("\r\n");
}

// Generates PowerShell 1-liner command
export function generatePowerShellCommand(selectedApps: { slug: string; name: string }[]): string {
  const commands = selectedApps.map(
    (app) => `winget install --id "${WINGET_MAP[app.slug] || app.name}" -e --silent --accept-source-agreements --accept-package-agreements`
  );
  return commands.join("; ");
}
