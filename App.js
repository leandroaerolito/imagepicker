import { Text, View, StatusBar, Button, Image } from "react-native";
import { useState, useEffect } from "react";

/* Importando os recursos da API nativa/móvel */
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  /* State tradicional para armazenar a referência da foto (quando existir) */
  const [foto, setFoto] = useState(null);

  /* State de checagem de permissões de uso (através do hook useCameraPermission) */
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  console.log(status);

  /* Ao entrar no app, será executada a verificação de permissões de uso */
  useEffect(() => {
    /* Esta função mostrará um popup para o usuário perguntando
    se ele autoriza a utilização do recurso móvel (no caso, selecionar/tirar foto). */
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      /* Ele dando autorização (granted), isso será armazenado
      no state de requestPermission. */
      requestPermission(cameraStatus === "granted");
    }

    verificaPermissoes();
  }, []);

  /* Ao pressionar o botão, execute esta função*/
  const escolherFoto = async () => {
    /* Acessando via ImagePicker a biblioteca para seleção de apenas imagens, com recurso de edição habilitado, proporção 16,9 e qualidade total */
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    /* Se o usuário não cancelar a operaçãom, pegamos a imagem e colocamos no state */
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };
  //console.log(foto);

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });
    /* Se o usuário não cancelar, atualizamos o state com a novo foto capturada */
    if (!imagem.canceled) {
      /* Usando a API do MediaLibrary para salvar no armazenamento físico do dispositivo */
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };

  return (
    <>
      <StatusBar />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={escolherFoto} title="Escolher foto" />
        <Button onPress={acessarCamera} title="Tirar uma nova foto" />
        {/* Ao executaR esta função quando o usurário escolhe tirar uma foto, utilizamos o launchCameraAsync para abrir a câmera do sistema operacional */}

        {foto ? (
          <Image source={{ uri: foto }} style={{ width: 300, height: 300 }} />
        ) : (
          <Text>Sem foto!</Text>
        )}
      </View>
    </>
  );
}
