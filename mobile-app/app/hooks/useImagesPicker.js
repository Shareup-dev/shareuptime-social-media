import { useState } from 'react';
import ImagePicker from 'react-native-image-picker';

export default function useImagePicker() {
  // const [imageUri, setImageUri] = useState("");
  const [files, setFiles] = useState([]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: '0.5',
      });
      // setImageUri(result.uri);
      setFiles(...files, result.url);
    } catch (error) {
      console.error('Error reading an image', error);
    }
    return null;
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return { files, pickImage, clearFiles };
}
