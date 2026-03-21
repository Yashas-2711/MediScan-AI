# MediScan AI 💊

MediScan AI is an intelligent mobile application built with React Native and Expo that helps users identify and understand their medications. By simply taking a photo or uploading an image of a medicine strip, box, or tablet, the app leverages Google Gemini AI to instantly extract critical details like the medicine name, its generic components, its uses, and potential side-effects.

To make this information even more accessible, MediScan AI employs Text-to-Speech (TTS) to automatically read the details out loud.

## Features ✨

- **📸 Instant Scanning:** Take a photo using your device camera or upload one from the gallery to scan any medicine.
- **🧠 AI-Powered Analysis:** Integrates seamlessly with the **Google Gemini API** for powerful OCR capabilities and intelligent understanding of the medication.
- **🔊 Text-to-Speech (TTS):** Automatically speaks the details of the scanned medicine for ease of accessibility. The app includes a dedicated TTS settings screen where you can adjust pitch and speed.
- **🕰️ Scan History:** Automatically saves previously scanned medicines so you never lose track of a result, bringing up the details instantly without a re-scan.
- **🎨 Modern & Interactive UI:** Built with fluid animations, a beautiful dark-mode first design, gradient overlays, and haptic feedback.

## Tech Stack 🛠️

- **Frontend:** [React Native](https://reactnative.dev) & [Expo](https://expo.dev) 
- **AI / OCR:** [Google Gemini AI](https://ai.google.dev/) (`@google/generative-ai`)
- **Navigation:** [React Navigation](https://reactnavigation.org/) (Bottom Tabs)
- **Device Capabilities:** 
  - `expo-camera` / `expo-image-picker` for Image Capture
  - `expo-speech` for Audio Feedback
- **Animation:** `react-native-reanimated` and `Animated` from React Native

## Project Structure 📁

```
medicine-scanner/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Bottom Tab Navigator configuration
│   │   ├── index.tsx        # Main Scanner Screen (MediScan AI)
│   │   ├── history.tsx      # Scan History View
│   │   ├── speak.tsx        # Text-to-Speech customization settings
│   │   └── about.tsx        # App info and about screen
├── components/            # Reusable UI components (ResultCard, etc.)
├── hooks/                 # Custom React hooks (e.g., useSpeech)
├── services/              # API services (geminiService.ts)
├── store/                 # State management (historyStore.ts)
└── assets/                # Images, fonts, and icons
```

## Getting Started 🚀

### Prerequisites
- Node.js (>= 18.x recommended)
- `npm` or `yarn`
- [Expo Go](https://expo.dev/go) installed on your iOS or Android device (for physical testing).

### Installation

1. **Clone the repository (if applicable)**
   ```bash
   git clone <repository_url>
   cd medicine-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root of your project and add your Google Gemini API key:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > You can get a free API key from the [Google AI Studio](https://aistudio.google.com/).

4. **Start the app**
   ```bash
   npx expo start
   ```

5. **Run on Device / Emulator**
   - Press **`a`** to open on an Android emulator.
   - Press **`i`** to open on an iOS simulator.
   - **Scan the QR code** using the Expo Go app on your physical device for the best camera testing experience.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Make sure to open an issue before creating large PRs so we can discuss the proposed changes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📜

This project is open-source and available under the [MIT License](LICENSE).
