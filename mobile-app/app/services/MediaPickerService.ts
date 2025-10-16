import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export interface MediaFile {
  uri: string;
  type: string;
  name: string;
  size: number;
}

export interface MediaPickerOptions {
  mediaType: 'photo' | 'video' | 'mixed';
  quality: PhotoQuality;
  maxWidth?: number;
  maxHeight?: number;
  includeBase64?: boolean;
  selectionLimit?: number;
}

export class MediaPickerService {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const cameraGranted =
          grants['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
        const storageGranted =
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED ||
          grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;

        return cameraGranted && storageGranted;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  }

  static async pickFromGallery(
    options: MediaPickerOptions = { mediaType: 'photo', quality: 0.8 },
  ): Promise<MediaFile[]> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Permissions not granted');
    }

    return new Promise((resolve, reject) => {
      const pickerOptions = {
        mediaType: options.mediaType as MediaType,
        quality: options.quality,
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
        includeBase64: options.includeBase64 || false,
        selectionLimit: options.selectionLimit || 1,
      };

      launchImageLibrary(pickerOptions, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve([]);
          return;
        }

        if (response.errorMessage) {
          reject(new Error(response.errorMessage));
          return;
        }

        if (response.assets) {
          const mediaFiles: MediaFile[] = response.assets.map((asset) => ({
            uri: asset.uri || '',
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `media_${Date.now()}.jpg`,
            size: asset.fileSize || 0,
          }));
          resolve(mediaFiles);
        } else {
          resolve([]);
        }
      });
    });
  }

  static async takePhoto(
    options: MediaPickerOptions = { mediaType: 'photo', quality: 0.8 },
  ): Promise<MediaFile | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Camera permissions not granted');
    }

    return new Promise((resolve, reject) => {
      const pickerOptions = {
        mediaType: options.mediaType as MediaType,
        quality: options.quality,
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
        includeBase64: options.includeBase64 || false,
      };

      launchCamera(pickerOptions, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve(null);
          return;
        }

        if (response.errorMessage) {
          reject(new Error(response.errorMessage));
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          const mediaFile: MediaFile = {
            uri: asset.uri || '',
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `photo_${Date.now()}.jpg`,
            size: asset.fileSize || 0,
          };
          resolve(mediaFile);
        } else {
          resolve(null);
        }
      });
    });
  }

  static showMediaPicker(
    options: MediaPickerOptions = { mediaType: 'photo', quality: 0.8 },
  ): Promise<MediaFile[]> {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Select Media',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              try {
                const media = await this.takePhoto(options);
                resolve(media ? [media] : []);
              } catch (error) {
                reject(error);
              }
            },
          },
          {
            text: 'Gallery',
            onPress: async () => {
              try {
                const media = await this.pickFromGallery(options);
                resolve(media);
              } catch (error) {
                reject(error);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve([]),
          },
        ],
        { cancelable: true },
      );
    });
  }

  // Media validation
  static validateMediaFile(file: MediaFile): { valid: boolean; error?: string } {
    // File size limit (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 50MB limit' };
    }

    // File type validation
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type' };
    }

    return { valid: true };
  }

  // Upload media to backend
  static async uploadMedia(
    files: MediaFile[],
    uploadType: 'profile' | 'post' | 'story' | 'message',
    _onProgress?: (progress: number) => void,
  ): Promise<string[]> {
    const formData = new FormData();

    files.forEach((file, _index) => {
      // React Native FormData accepts { uri, type, name } objects; TS lib.dom types don't cover this.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData.append(uploadType === 'profile' ? 'profilePicture' : `${uploadType}Media`, {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
    });

    try {
      const response = await fetch(`http://localhost:4000/api/upload/${uploadType}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      return result.urls || [];
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
    // Resize image for optimization
    static async resizeImage(
      file: MediaFile,
      _options: {
        width?: number;
        height?: number;
        quality?: number;
      },
    ): Promise<MediaFile> {
    // This would typically use a library like react-native-image-resizer
    // For now, return the original file
    return file;
    }
  }

  export default MediaPickerService;
