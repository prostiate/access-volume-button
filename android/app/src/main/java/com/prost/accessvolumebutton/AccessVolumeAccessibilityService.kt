package com.prost.accessvolumebutton

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.content.Intent
import android.util.Log

class AccessVolumeAccessibilityService : AccessibilityService() {

    companion object {
        var instance: AccessVolumeAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        Log.d("AccessVolume", "Accessibility Service Connected")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // TODO: Handle events like window state changes for keyboard detection
    }

    override fun onInterrupt() {
        instance = null
        Log.d("AccessVolume", "Accessibility Service Interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
    }

    fun performAction(action: Int): Boolean {
        return performGlobalAction(action)
    }
}
