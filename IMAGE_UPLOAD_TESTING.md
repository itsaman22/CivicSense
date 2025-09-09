# 🧪 Testing Image Upload Feature

## Sample Issue for Testing:

**Title:** Large pothole causing accidents near Sarita Vihar Metro Station

**Category:** Infrastructure  

**Location:** Main road opposite Sarita Vihar Metro Station, near Apollo Pharmacy, New Delhi - 110076

**Description:** 
There is a massive pothole (approximately 3 feet wide and 1.5 feet deep) on the main road directly opposite the Sarita Vihar Metro Station exit gate. The pothole has developed over the past 2 months due to recent monsoon rains and heavy traffic.

The pothole is causing serious problems:
- Multiple vehicle accidents daily, especially during evening rush hours
- Two-wheelers are particularly at risk and several have fallen into it
- Water accumulates during rain making it invisible and more dangerous
- Traffic congestion as vehicles swerve to avoid the pothole
- Damage to vehicle tires and suspension systems

This is located on a busy arterial road used by thousands of commuters daily. The pothole is right in the main traffic lane and cannot be easily avoided. Several residents have complained but no action has been taken by MCD.

Immediate repair is urgently needed before more serious accidents occur. The location is highly visible and accessible for repair crews.

**Images Required:** 
- Minimum 2 images, maximum 5 images
- Formats: JPEG, PNG, WebP
- Maximum 2MB per image

## Features Added:

✅ **Image Upload Validation**
- Minimum 2 images required
- Maximum 5 images allowed
- File size limit: 2MB per image
- Supported formats: JPEG, PNG, WebP

✅ **Base64 Storage**
- Images stored as base64 in MongoDB
- Optimized for free MongoDB cluster limits
- Image serving endpoint: `/api/issues/:id/image/:index`

✅ **User Interface**
- File upload input with drag-and-drop styling
- Image preview with file names and sizes
- Real-time validation and error messages
- Upload progress indicator

✅ **Backend Validation**
- Server-side image validation
- MIME type checking
- File size verification
- Proper error handling

## How to Test:

1. **Login as User**
2. **Go to "Post Issue" tab**
3. **Fill in all required fields**
4. **Upload at least 2 images (under 2MB each)**
5. **Submit the issue**
6. **Check "Browse Issues" to see images displayed**
7. **Login as Admin to verify visibility**

## API Endpoints:

- `POST /api/issues` - Create issue with images
- `GET /api/issues/:id/image/:index` - Serve individual images
- `GET /api/issues` - Get all issues (includes image metadata)

The system now requires proof images for all issue submissions! 📸
