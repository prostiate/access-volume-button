package com.prost.accessvolumebutton

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Intent
import android.provider.Settings
import android.net.Uri
import android.os.Build

class AccessVolumeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AccessVolume"
    }

    @ReactMethod
    fun startOverlay() {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.action = "START"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(intent)
        } else {
            reactApplicationContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopOverlay() {
        val intent = Intent(reactApplicationContext, OverlayService::class.java)
        intent.action = "STOP"
        reactApplicationContext.startService(intent)
    }

    @ReactMethod
    fun checkOverlayPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            promise.resolve(Settings.canDrawOverlays(reactApplicationContext))
        } else {
            promise.resolve(true)
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
         promise.resolve(AccessVolumeAccessibilityService.instance != null)
    }
}
