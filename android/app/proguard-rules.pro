# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Keep the ImagePicker class and its methods
-keep class abi39_0_0.org.unimodules.interfaces.imagepicker.ImagePicker { *; }

# Keep the ImagePicker module's implementation class and its methods
-keep class expo.modules.imagepicker.ImagePickerModule { *; }