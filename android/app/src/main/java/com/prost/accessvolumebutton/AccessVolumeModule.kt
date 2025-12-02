package com.prost.accessvolumebutton

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Intent
import android.provider.Settings
import android.net.Uri
import android.os.Build
import android.util.Log

class AccessVolumeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AccessVolume"
    }

    @ReactMethod
    fun startOverlay() {
        Log.d("AccessVolume", "Starting Overlay Service")
        try {
            val intent = Intent(reactApplicationContext, OverlayService::class.java)
            intent.action = "START"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactApplicationContext.startForegroundService(intent)
            } else {
                reactApplicationContext.startService(intent)
            }
        } catch (e: Exception) {
            Log.e("AccessVolume", "Error starting overlay", e)
        }
    }

    @ReactMethod
    fun stopOverlay() {
        Log.d("AccessVolume", "Stopping Overlay Service")
        try {
            val intent = Intent(reactApplicationContext, OverlayService::class.java)
            intent.action = "STOP"
            reactApplicationContext.startService(intent)
        } catch (e: Exception) {
             Log.e("AccessVolume", "Error stopping overlay", e)
        }
    }

    @ReactMethod
    fun checkOverlayPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                promise.resolve(Settings.canDrawOverlays(reactApplicationContext))
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + reactApplicationContext.packageName))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
        }
    }
    
    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }
    
    @ReactMethod
    fun performGlobalAction(action: Int, promise: Promise) {
        val service = AccessVolumeAccessibilityService.instance
        if (service != null) {
            val result = service.performAction(action)
            promise.resolve(result)
        } else {
            promise.reject("SERVICE_NOT_CONNECTED", "Accessibility Service is not connected")
        }
    }
    
    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
         // This only checks if our service instance is alive (connected)
         // A better check would be to query AccessibilityManager, but this is a good proxy for "ready to use"
         promise.resolve(AccessVolumeAccessibilityService.instance != null)
    }

    @ReactMethod
    fun updateConfig(configJson: String) {
        Log.d("AccessVolume", "Updating config: $configJson")
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.action = "UPDATE_CONFIG"
        intent.putExtra("config", configJson)
        reactApplicationContext.startService(intent)
    }
}
