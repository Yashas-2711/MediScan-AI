export default {
  expo: {
    name: "MediScan-AI",
    slug: "medicine-scanner",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "medicinescanner",
    userInterfaceStyle: "automatic",

    extra: {
      GEMINI_MODEL:"gemini-3.1-flash-lite-preview",
      router: {},
      eas: {
        projectId: "b8974efe-fc71-4146-9739-31be72431b1a"
      }
    },
 updates: {
      url: "https://u.expo.dev/b8974efe-fc71-4146-9739-31be72431b1a"
    },

    runtimeVersion: {
      policy: "appVersion"
    },

    android: {
      package: "com.yash_27112005.medicinescanner"
    }
  }
};