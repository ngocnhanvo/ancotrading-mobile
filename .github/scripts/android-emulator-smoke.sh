#!/usr/bin/env bash
set -euo pipefail

OUT="${GITHUB_WORKSPACE}/emulator-results"
mkdir -p "$OUT"
PKG="com.anco2019"
APK="android/app/build/outputs/apk/debug/app-debug.apk"

echo "Smoke test source-built APK on Android 15 tablet-like emulator."
echo "This checks installation, startup, process survival, and error logs."
echo "It does NOT verify the user's separately provided APK or physical camera autofocus."

adb wait-for-device
adb shell wm size 1600x2560
adb shell wm density 240
adb shell settings put system accelerometer_rotation 0 || true
adb shell settings put system user_rotation 0 || true

# Avoid production API calls while performing a startup smoke test.
adb shell svc wifi disable || true
adb shell svc data disable || true

test -f "$APK"
adb install -r "$APK" | tee "$OUT/install.txt"
adb shell pm grant "$PKG" android.permission.CAMERA || true
adb logcat -c
adb shell am force-stop "$PKG" || true
adb shell am start -W -n "$PKG/.MainActivity" | tee "$OUT/activity-start.txt"
sleep 30

adb shell getprop ro.build.version.release > "$OUT/android-version.txt"
adb shell getprop ro.product.cpu.abi > "$OUT/cpu-abi.txt"
adb shell getconf PAGE_SIZE > "$OUT/page-size.txt" || true
adb shell pidof "$PKG" > "$OUT/app-pid.txt" || true
adb shell screencap -p /sdcard/anco-screen.png || true
adb pull /sdcard/anco-screen.png "$OUT/anco-screen.png" || true
adb logcat -d -v time -s AndroidRuntime:E ReactNativeJS:E ReactNative:E libc:F > "$OUT/errors.txt" || true
adb shell dumpsys activity activities > "$OUT/activities.txt" || true

if [[ -s "$OUT/app-pid.txt" ]]; then
  echo "PASS: $PKG is still running after 30 seconds." | tee "$OUT/result.txt"
else
  echo "FAIL: $PKG is not running after 30 seconds." | tee "$OUT/result.txt"
  exit 1
fi

if grep -q "FATAL EXCEPTION" "$OUT/errors.txt"; then
  echo "WARNING: AndroidRuntime fatal exception logged; inspect errors.txt" | tee -a "$OUT/result.txt"
  exit 1
fi
