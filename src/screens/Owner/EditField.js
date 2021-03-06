import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Image, TouchableOpacity, View, Alert, TextInput } from "react-native";
import {
  Button,
  Container,
  Content,
  Card,
  CardItem,
  Header,
  Form,
  Item,
  Input,
  Text,
  Picker,
  Label
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { getCourtId, editCourt } from "../../store/actions/court";
import { getAccessToken, removeToken } from "../../utility/token";
import * as ImagePicker from "expo-image-picker";
import { Feather, AntDesign, Entypo, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const EditField = ({ route, navigation }) => {
  const { id } = route.params.params;
  const dispatch = useDispatch();
  const court = useSelector((state) => state.court);
  const owner = useSelector(state => state.user)

  const [image, setImage] = useState(null);
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [tipe, setTipe] = useState(null);
  const [schedule1, setSchedule1] = useState(null);
  const [schedule2, setSchedule2] = useState(null);
  const [address, setAddress] = useState(null);
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    getAccessToken()
      .then((res) => {
        dispatch(getCourtId(id, res));
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  useEffect(() => {
    if (court) {
      setImage(court.photos);
      setName(court.name);
      setPrice(court.price);
      setTipe(court.type);
      setSchedule1(court.schedule.open);
      setSchedule2(court.schedule.close);
      setAddress(court.address);
    }
  }, [court]);

  useEffect(() => {
    //buat ngambil file
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const onCheckLimit = (value) => {
    const parsedQty = Number.parseInt(value)
    if (Number.isNaN(parsedQty)) {
      setSchedule1(0) //setter for state
    } else if (parsedQty > 24) {
      setSchedule1(24)
      console.log(schedule1)
    } else if (parsedQty < 0) {
      setSchedule1(0)
    } else {
      setSchedule1(parsedQty)
    }
  }

  const onCheckLimit2 = (value) => {
    const parsedQty = Number.parseInt(value)
    if (Number.isNaN(parsedQty)) {
      setSchedule2(0) //setter for state
    } else if (parsedQty > 24) {
      setSchedule2(24)
    } else if (parsedQty < 0) {
      setSchedule2(0)
    } else {
      setSchedule2(parsedQty)
    }
  }

  const onSubmit = () => {
    Alert.alert(
      "Notification",
      "Are you sure want to edit the court data?",
      [
        {
          text: "Ok",
          onPress: () => goUpdate()
        },
        {
          text: "Cancel",
          onPress: () => navigation.navigate("OwnerApp")
        }
      ]
    )
  };

  const goUpdate = () => {
    if (!name || !price || !tipe || !schedule1 || !schedule2 || !image || !address) {
      setIsValid(false)
      setTimeout(() => {
        setIsValid(true)
      }, 2500);
    } else {
      const tanggal = {
        open: schedule1,
        close: schedule2,
      };

      const position = {
        lat: owner.position.lat,
        lng: owner.position.lng,
      };

      let formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("type", tipe);
      formData.append("position", JSON.stringify(position));
      formData.append("schedule", JSON.stringify(tanggal));
      formData.append("address", address);
      formData.append("owner", JSON.stringify(owner));
      formData.append("photos", {
        uri: image,
        name: image.split("/").pop(),
        type: "image/jpg",
      });
      getAccessToken()
        .then((res) => {
          dispatch(editCourt(res, id, formData, owner._id))
          navigation.navigate("OwnerApp")
        })
        .catch((err) => console.log(err));
    }
  }

  //buat ngambil file
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      console.log(image);
    }
  };
  // ampe sini

  const logout = () => {
    removeToken();
    dispatch({
      type: "set-role",
      payload: "",
    });
    navigation.navigate("LoginPage");
  };

  return (
    <Container>
      <Content>
      <Header style={{ flexDirection: "row", padding: 15, backgroundColor: '#EF7911'}}>
        <Text style={{color: 'white', fontSize: 20, marginLeft: "auto" }}>Edit Field</Text>
          <TouchableOpacity style={{marginLeft: "auto" }} onPress={() => logout()}>
            <Feather
              name="log-out"
              size={25}
              color="white"
            />
          </TouchableOpacity>
      </Header>
        <Card style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
        {
          !isValid ? <Text style={{color: 'red'}}>Please Fill All Field !</Text>: <Text></Text>
        }
        <Form style={{marginTop: 0}}>
          <Item style={{marginRight: 20, marginTop: 0}} floatingLabel>
            <Label>Name</Label>
            <Input
              required
              placeholder="name"
              onChangeText={(value) => setName(value)}
              value={name}
            />
          </Item>
          <Text style={{marginLeft: 15, marginBottom: 10, marginTop: 10, color: 'grey'}}>Image Preview:</Text>
          <Item style={{marginRight: 20, borderBottomWidth: 0}}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 250, height: 150 }}
              />
            )}
            <Button transparent style={{marginLeft: "auto", marginTop: "auto"}} onPress={pickImage}>
              <Entypo name="image" size={50} color="black" />
            </Button>
          </Item>
          <Item style={{marginRight: 20}} floatingLabel>
            <Label>Price</Label>
            <Input
              required
              placeholder="price"
              keyboardType={"number-pad"}
              onChangeText={(value) => setPrice(value)}
              value={price}
            />
          </Item>
          <Text style={{marginLeft: 15, marginTop: 10, color: 'grey'}}>Type: </Text>
          <Item style={styles.item} picker style={{marginLeft: 15, marginRight: 20}}>
            <Picker
              mode="dropdown"
              placeholder="Type"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={tipe}
              onValueChange={(value) => setTipe(value)}
              value={tipe}
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Vinyl" value="Vinyl" />
              <Picker.Item label="Parquette" value="Parquette" />
              <Picker.Item label="Taraflex" value="Taraflex" />
              <Picker.Item label="Polyethyle" value="Polyethyle" />
              <Picker.Item label="Synthetic" value="Synthetic" />
              <Picker.Item label="Cement" value="Cement" />
            </Picker>
          </Item>
          <View style={{flex: 1, flexDirection: "row"}}>
            <Item style={{marginRight: 20, width: 150, height: 50, borderBottomWidth: 0}} floatingLabel>
              <Label>Open Hour</Label>
              <Input
                required
                keyboardType='numeric'
                onChangeText={(text)=> onCheckLimit(text)}
                value={schedule1}
                maxLength={2}
              />
            </Item>
            <Item style={{marginRight: 20, width: 150, height: 50, borderBottomWidth: 0}} floatingLabel>
              <Label>Close Hour</Label>
              <Input
                required
                maxLength={2}
                onChangeText={(value) => onCheckLimit2(value)}
                keyboardType='numeric'
                value={schedule2}
              />
            </Item>
          </View>
          <Item style={{marginRight: 20}} floatingLabel>
            <Label>Address</Label>
            <Input
              required
              placeholder="address"
              onChangeText={(value) => setAddress(value)}
              value={address}
            />
          </Item>
          <View style={{marginBottom: 20, flex: 1, flexDirection: "row"}}>
            <Button
              bordered
              dark
              style={styles.button}
              onPress={() => onSubmit()}
            >
              <Text>Edit Field</Text>
            </Button>
            <Button 
              bordered
              dark
              style={styles.button}
              onPress={() => navigation.goBack()}
            > 
              <Text>Cancel</Text>
            </Button>
          </View>
        </Form>
        </Card>
      </Content>
    </Container>
  );
};

const styles = {
  header: {
    height: 200,
    backgroundColor: "white",
    borderBottomWidth: 0,
    elevation: 0,
  },
  flex: {
    width: 300,
    flex: 1,
  },
  form: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  item: {
  },
  itemBtn: {
    borderBottomWidth: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 30,
    backgroundColor: "#ff9900",
  },
};

export default EditField;
