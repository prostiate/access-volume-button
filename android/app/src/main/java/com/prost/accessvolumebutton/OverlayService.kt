package com.prost.accessvolumebutton

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.view.WindowManager
import android.graphics.PixelFormat
import android.view.Gravity
import android.view.View
import android.view.LayoutInflater
import android.widget.LinearLayout
import android.widget.Button
import android.content.Context
import android.os.Build
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Notification
import androidx.core.app.NotificationCompat
import android.view.MotionEvent
import android.util.Log
import android.content.pm.ServiceInfo

class OverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private val TAG = "AccessVolumeOverlay"

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "onCreate called")
        try {
            windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
            createNotificationChannel()
            
            val notification = createNotification()
            if (Build.VERSION.SDK_INT >= 34) {
                // Android 14 requires specifying the foreground service type
                Log.d(TAG, "Starting foreground service with type SPECIAL_USE")
                startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
            } else {
                Log.d(TAG, "Starting foreground service (legacy)")
                startForeground(1, notification)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error in onCreate", e)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "onStartCommand action: ${intent?.action}")
        if (intent?.action == "START") {
            showOverlay()
        } else if (intent?.action == "STOP") {
            stopSelf()
        }
        return START_STICKY
    }

    private fun showOverlay() {
        Log.d(TAG, "showOverlay called")
        if (overlayView != null) {
            Log.d(TAG, "Overlay already exists")
            return
        }

        try {
            val params = WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                else
                    WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
            )

            params.gravity = Gravity.TOP or Gravity.START
            params.x = 0
            params.y = 100

            // Create a simple layout with buttons
            val layout = LinearLayout(this)
            layout.orientation = LinearLayout.VERTICAL
            layout.setBackgroundColor(0x88000000.toInt()) // Semi-transparent black
            layout.setPadding(16, 16, 16, 16)

            val btnUp = Button(this)
            btnUp.text = "+"
            btnUp.setOnClickListener {
                Log.d(TAG, "Volume Up clicked")
                val audioManager = getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
                audioManager.adjustVolume(android.media.AudioManager.ADJUST_RAISE, android.media.AudioManager.FLAG_SHOW_UI)
            }

            val btnDown = Button(this)
            btnDown.text = "-"
            btnDown.setOnClickListener {
                Log.d(TAG, "Volume Down clicked")
                val audioManager = getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
                audioManager.adjustVolume(android.media.AudioManager.ADJUST_LOWER, android.media.AudioManager.FLAG_SHOW_UI)
            }

            layout.addView(btnUp)
            layout.addView(btnDown)

            overlayView = layout
            
            // Add drag listener
            layout.setOnTouchListener(object : View.OnTouchListener {
                private var initialX = 0
                private var initialY = 0
                private var initialTouchX = 0f
                private var initialTouchY = 0f

                override fun onTouch(v: View, event: MotionEvent): Boolean {
                    when (event.action) {
                        MotionEvent.ACTION_DOWN -> {
                            initialX = params.x
                            initialY = params.y
                            initialTouchX = event.rawX
                            initialTouchY = event.rawY
                            return true
                        }
                        MotionEvent.ACTION_MOVE -> {
                            params.x = initialX + (event.rawX - initialTouchX).toInt()
                            params.y = initialY + (event.rawY - initialTouchY).toInt()
                            windowManager?.updateViewLayout(overlayView, params)
                            return true
                        }
                    }
                    return false
                }
            })

            Log.d(TAG, "Adding view to WindowManager")
            windowManager?.addView(overlayView, params)
            Log.d(TAG, "View added successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Error showing overlay", e)
        }
    }

    override fun onDestroy() {
        Log.d(TAG, "onDestroy called")
        super.onDestroy()
        if (overlayView != null) {
            try {
                windowManager?.removeView(overlayView)
            } catch (e: Exception) {
                Log.e(TAG, "Error removing overlay view", e)
            }
            overlayView = null
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                "OverlayServiceChannel",
                "Overlay Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, "OverlayServiceChannel")
            .setContentTitle("Access Volume Button")
            .setContentText("Overlay is running")
            .setSmallIcon(R.mipmap.ic_launcher)
            .build()
    }
}
