import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
} from "@ionic/react";
import { useEffect, useState } from "react";
import "./Tab1.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import config from "../config.json";
import { useAddUserMutation } from "../api/endpoints/users";
import Header from "../components/header";

const POST_USER_REQUEST = "POST_USER_REQUEST";
const POST_USER_SUCCESS = "POST_USER_SUCCESS";
const POST_USER_FAILURE = "POST_USER_FAILURE";

const postUser: any =
  (formData: { email: string; password: string }) => async (dispatch: any) => {
    dispatch({ type: POST_USER_REQUEST });

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}user`,
        formData,
        {
          withCredentials: true, // Correctly add withCredentials in the config object
        }
      );
      dispatch({
        type: POST_USER_SUCCESS,
        payload: response.data,
      });
    } catch (error: any) {
      dispatch({
        type: POST_USER_FAILURE,
        payload: error.message || "Something went wrong",
      });
    }
  };

const Tab1: React.FC = () => {
  // Initialize state as an object with email and password properties
  const [newUser, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: CustomEvent, name: string) => {
    setFormData((prevState) => ({
      ...prevState, // Copy previous state
      [name]: e.detail.value, // Update the specific field (email or password)
    }));
  };

  const [addUser, { data: addedUser, isLoading, isSuccess, isError, error }] =
    useAddUserMutation();

/*   const handleAddUser = async () => {
    try {
      await addUser(newUser).unwrap(); // .unwrap() allows explicit error handling
      alert("User added successfully!");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  }; */

  useEffect(() => {
    if (isSuccess) {
      alert("User created successfully!");
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email Submitted: ", newUser.email);
    console.log("Password Submitted: ", newUser.password);
    addUser(newUser);
  };
  let content: React.ReactNode;

  if (isLoading) {
    content = <div>loading..</div>;
  } else if (isSuccess) {
    content = (
      <div>
        <p>User created successfully!</p>
        <pre>{JSON.stringify(addedUser, null, 2)}</pre>
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <p>Error creating user</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }


  return (
    <IonPage>
      <Header title="Tab 1" />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form className="ion-padding" onSubmit={handleSubmit}>
          <IonInput
            labelPlacement="floating"
            fill="solid"
            type="email"
            name="email" // Set the input name for email
            value={newUser.email} // Bind email state to the input
            onIonInput={(e) => handleInputChange(e, "email")}
          >
            <div slot="label">Email</div> {/* Correct label placement */}
          </IonInput>
          <IonInput
            labelPlacement="floating"
            fill="solid"
            type="password"
            name="password" // Set the input name for password
            value={newUser.password} // Bind password state to the input
            onIonInput={(e) => handleInputChange(e, "password")}
          >
            <div slot="label">Contraseña</div> {/* Correct label placement */}
          </IonInput>
          <IonButton type="submit">Sortu</IonButton>
        </form>
        {content}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
