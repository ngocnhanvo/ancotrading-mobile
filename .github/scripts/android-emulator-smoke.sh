#!/usr/bin/env bash
set -euo pipefail

OUT="$GITHUB_WORKSPACE/emulator-results"
mkdir -p "$OUT"
PKG="com.anco2019"
APK="$RUNNER_TEMP/anco-original.apk"

echo "APK-only smoke test on Android 15 tablet-like emulator"
echo "Using the original APK supplied for the test, not building from source."
echo "Original APK SHA-256: 17bfa983fd632644292cedb132ffed5e552d15f61de5d16efe2e82f21afad394"

adb wait-for-device
adb shell wm size 1600x2560
adb shell wm density 240
adb shell settings put system accelerometer_rotation 0 || true
adb shell settings put system user_rotation 0 || true

# Avoid accidental contact with live ANCO servers during a smoke test.
adb shell svc wifi disable || true
adb shell svc data disable || true

test -s "$APK"
adb install -r "$APK" 2>&1 | tee "$OUT/install.txt"
adb shell pm grant "$PKG" android.permission.CAMERA || true
adb logcat -c
adb shell am force-stop "$PKG" || true
adb shell am start -W -n "$PKG/.MainActivity" 2>&1 | tee "$OUT/activity-start.txt"
sleep 30

adb shell getprop ro.build.version.release > "$OUT/android-version.txt"
adb shell getprop ro.product.cpu.abi > "$OUT/cpu-abi.txt"
adb shell getconf PAGE_SIZE > "$OUT/page-size.txt" || true
adb shell pidof "$PKG" > "$OUT/app-pid.txt" || true
adb shell screencap -p /sdcard/anco-screen.png || true
adb pull /sdcard/anco-screen.png "$OUT/anco-screen.png" || true
adb logcat -d -v time > "$OUT/logcat-full.txt" || true
adb logcat -d -v time -s AndroidRuntime:E ReactNativeJS:E ReactNative:E libc:F > "$OUT/errors.txt" || true
adb shell dumpsys activity activities > "$OUT/activities.txt" || true

if [[ -s "$OUT/app-pid.txt" ]]; then
  echo "PASS: $PKG still running after 30 seconds" | tee "$OUT/result.txt"
else
  echo "FAIL: $PKG exited or crashed within 30 seconds" | tee "$OUT/result.txt"
  exit 1
fi

if grep -q "FATAL EXCEPTION" "$OUT/errors.txt"; then
  echo "FAIL: fatal Android exception found in logs" | tee -a "$OUT/result.txt"
  exit 1
fi


echo "Opening SCAN NOW button on the original APK for camera/QR smoke test."
adb logcat -c
read -r TAP_X TAP_Y < <(python3 - <<'PY'
from pathlib import Path
import struct
data = Path('emulator-results/anco-screen.png').read_bytes()[:24]
width, height = struct.unpack('>II', data[16:24])
print(round(width * 0.50), round(height * 0.965))
PY
)
echo "Tap SCAN NOW at x=$TAP_X, y=$TAP_Y" | tee "$OUT/scan-tap.txt"
adb shell input tap "$TAP_X" "$TAP_Y"
sleep 12
adb shell screencap -p /sdcard/anco-scan-screen.png || true
adb pull /sdcard/anco-scan-screen.png "$OUT/anco-scan-screen.png" || true
adb logcat -d -v time > "$OUT/scan-logcat-full.txt" || true
adb logcat -d -v time -s AndroidRuntime:E ReactNativeJS:E ReactNative:E libc:F > "$OUT/scan-errors.txt" || true
adb shell pidof "$PKG" > "$OUT/scan-app-pid.txt" || true
adb shell dumpsys activity activities > "$OUT/scan-activities.txt" || true

if [[ -s "$OUT/scan-app-pid.txt" ]]; then
  echo "PASS: app process survived SCAN NOW navigation." | tee -a "$OUT/result.txt"
else
  echo "FAIL: app process died after tapping SCAN NOW." | tee -a "$OUT/result.txt"
  exit 1
fi
if grep -q "FATAL EXCEPTION" "$OUT/scan-errors.txt"; then
  echo "FAIL: Android fatal exception found after SCAN NOW." | tee -a "$OUT/result.txt"
  exit 1
fi
echo "NOTE: screenshot and logs require manual review for actual camera readiness." | tee -a "$OUT/result.txt"
