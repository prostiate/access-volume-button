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
        } else if (intent?.action == "UPDATE_CONFIG") {
            val configJson = intent.getStringExtra("config")
            if (configJson != null) {
                updateOverlayConfig(configJson)
            }
        }
        return START_STICKY
    }

    private fun updateOverlayConfig(configJson: String) {
        Log.d(TAG, "Updating overlay config: $configJson")
        try {
            val jsonObject = org.json.JSONObject(configJson)
            // Parse config
            val styleId = jsonObject.optString("styleId", "android")
            val accentColor = jsonObject.optString("accentColor", "#2196F3")
            val backgroundColor = jsonObject.optString("backgroundColor", "#FFFFFF")
            val buttonSize = jsonObject.optInt("buttonSize", 70)
            val buttonTransparency = jsonObject.optDouble("buttonTransparency", 0.0).toFloat()
            val sliderHeight = jsonObject.optInt("sliderHeight", 216)
            val powerButtonEnabled = jsonObject.optBoolean("powerButtonEnabled", false)
            val powerButtonPosition = jsonObject.optString("powerButtonPosition", "above")
            
            // Re-create overlay with new config
            if (overlayView != null) {
                windowManager?.removeView(overlayView)
                overlayView = null
            }
            createOverlayView(styleId, accentColor, backgroundColor, buttonSize, buttonTransparency, sliderHeight, powerButtonEnabled, powerButtonPosition)
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing config", e)
        }
    }

    private fun showOverlay() {
        if (overlayView != null) return
        // Default config if starting without update
        createOverlayView("android", "#2196F3", "#FFFFFF", 70, 0f, 216, false, "above")
    }

    private fun createOverlayView(styleId: String, accentColor: String, backgroundColor: String, buttonSize: Int, transparency: Float, sliderHeight: Int, powerButtonEnabled: Boolean, powerButtonPosition: String) {
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

            val layout = LinearLayout(this)
            layout.orientation = LinearLayout.VERTICAL
            layout.setBackgroundColor(0x00000000)
            layout.setPadding(0, 0, 0, 0)

            // Convert dp to px
            val density = resources.displayMetrics.density
            val sizePx = (buttonSize * density).toInt()
            val marginPx = (10 * density).toInt()

            val btnParams = LinearLayout.LayoutParams(sizePx, sizePx)
            btnParams.setMargins(0, 0, 0, marginPx)

            // Power Button (if enabled and positioned above)
            if (powerButtonEnabled && powerButtonPosition == "above") {
                val btnPower = Button(this)
                btnPower.text = "⏻"
                btnPower.setTextColor(android.graphics.Color.WHITE)
                btnPower.background = createButtonDrawable(styleId, "#FF5722", transparency)
                btnPower.setOnClickListener {
                    // Power button action - could show power menu or lock screen
                    Log.d(TAG, "Power button clicked")
                }
                layout.addView(btnPower, btnParams)
            }

            // Volume Up Button
            val btnUp = Button(this)
            btnUp.text = "+"
            btnUp.setTextColor(android.graphics.Color.WHITE)
            btnUp.background = createButtonDrawable(styleId, accentColor, transparency)
            btnUp.setOnClickListener {
                val audioManager = getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
                audioManager.adjustVolume(android.media.AudioManager.ADJUST_RAISE, android.media.AudioManager.FLAG_SHOW_UI)
            }

            // Volume Down Button
            val btnDown = Button(this)
            btnDown.text = "-"
            btnDown.setTextColor(android.graphics.Color.WHITE)
            btnDown.background = createButtonDrawable(styleId, accentColor, transparency)
            btnDown.setOnClickListener {
                val audioManager = getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
                audioManager.adjustVolume(android.media.AudioManager.ADJUST_LOWER, android.media.AudioManager.FLAG_SHOW_UI)
            }

            layout.addView(btnUp, btnParams)
            layout.addView(btnDown, btnParams)

            // Power Button (if enabled and positioned below)
            if (powerButtonEnabled && powerButtonPosition == "below") {
                val btnPower = Button(this)
                btnPower.text = "⏻"
                btnPower.setTextColor(android.graphics.Color.WHITE)
                btnPower.background = createButtonDrawable(styleId, "#FF5722", transparency)
                btnPower.setOnClickListener {
                    // Power button action
                    Log.d(TAG, "Power button clicked")
                }
                layout.addView(btnPower, btnParams)
            }

            overlayView = layout
            
            // Drag logic
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

            windowManager?.addView(overlayView, params)
        } catch (e: Exception) {
            Log.e(TAG, "Error creating overlay view", e)
        }
    }

    private fun createButtonDrawable(styleId: String, colorStr: String, transparency: Float): android.graphics.drawable.Drawable {
        val color = android.graphics.Color.parseColor(colorStr)
        // Apply transparency
        val alpha = ((1 - transparency) * 255).toInt()
        val colorWithAlpha = androidx.core.graphics.ColorUtils.setAlphaComponent(color, alpha)
        
        val drawable = android.graphics.drawable.GradientDrawable()
        drawable.setColor(colorWithAlpha)
        
        if (styleId == "android12" || styleId == "rgb") {
             drawable.shape = android.graphics.drawable.GradientDrawable.OVAL
        } else {
             drawable.shape = android.graphics.drawable.GradientDrawable.RECTANGLE
             drawable.cornerRadius = 20f
        }
        
        if (styleId == "rgb") {
            drawable.setStroke(5, android.graphics.Color.CYAN) // Neon effect
        }
        
        return drawable
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
