import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
import spinAudioSound from "../../../Assets/Audio/wheelSound.mp3";
import ReactPlayer from "react-player";
import axios from "axios";
import swal from "sweetalert";
import roulettePointer from "../../../Assets/Images/Spin/pointer.png";
import "./spin.css";
import { toast } from "react-toastify";

const data = [
  { option: "Earphone", style: { backgroundColor: "#131dfb" } },
  { option: "Try Again", style: { backgroundColor: "#6bb7da" } },
  { option: "Try Again", style: { backgroundColor: "#f77119" } },
  { option: "10 Points", style: { backgroundColor: "#24fb1d" } },
  { option: "Try Again", style: { backgroundColor: "#131dfb" } },
  { option: "Try Again", style: { backgroundColor: "#f77119" } },
  { option: "I Phone", style: { backgroundColor: "#fb1414" } },
  { option: "Try Again", style: { backgroundColor: "#7413fb" } },
  { option: "Try Again", style: { backgroundColor: "#131dfb" } },
  { option: "Try Again", style: { backgroundColor: "#6bb7da" } },
  { option: "100 Points", style: { backgroundColor: "#24fb1d" } },
  { option: "Try Again", style: { backgroundColor: "#fb1414" } },
];

const x = 5
const SpinWheel = ({ setLoading, loading }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null); // Initialize prizeNumber as null
  const [winPrice, setWinPrice] = useState(null);
  const [spinSound, setSpinSound] = useState(false);
  const [getPromoCode, setGetPromoCode] = useState(null);
  const [spinCountDetails, setSpinCountDetails] = useState({});
  const [spinCall, setSpinCall] = useState(false);
  const handleSpinClick = () => {
    setSpinSound(true);
    setSpinCall(true);
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      if (newPrizeNumber === 6) {
        setPrizeNumber(newPrizeNumber - 1);
      }
      if (newPrizeNumber === 0) {
        setPrizeNumber(newPrizeNumber + 1);
      }
      else if (x === 5){
        setPrizeNumber(10);
      }
      else {
        setPrizeNumber(newPrizeNumber);
      }
      setMustSpin(true);
    }
  };
  const selectData = data.find((item, index) => index === prizeNumber);

  useEffect(() => {
    // get invite code and validate by time 1 day
    axios
      .get("/api/update_invite_code")
      .then((res) => {
        setGetPromoCode(res?.data?.code);
        setSpinCountDetails({
          free_spin: res?.data?.wallet?.free_spin,
          spin_count: res?.data?.wallet?.spin_count,
          code_used: res?.data?.code_used,
        });
      })
      .catch((err) => {
        swal("Error", `${err?.message}`, "error");
      });
  }, []);

  // set time and change new spin count
  useEffect(() => {
    if (spinCall) {
      const spinCallTimeOut = setTimeout(() => {
        //  spin count api
        axios
          .get("/api/update_spin_count")
          .then((res) => {
            setSpinCountDetails({
              free_spin: res?.data?.wallet?.free_spin,
              spin_count: res?.data?.wallet?.spin_count,
              code_used: res?.data?.code_used,
            });
          })
          .catch((err) => {
            swal("Error", `${err?.message}`, "error");
          });
      }, 11000); // 10 seconds in milliseconds

      // Clean up the timeout to avoid memory leaks
      return () => clearTimeout(spinCallTimeOut);
    }
  }, [spinCall]);

  if (
    spinCountDetails?.free_spin === 0 &&
    spinCountDetails?.code_used === false
  ) {
    swal({
      title: "Don't worry! You still have chance.",
      content: {
        element: "span",
        attributes: {
          innerHTML: `<span style='font-weight: bold;'> Invite friends to get more chance! <br/P> Here is your invitation code: ${getPromoCode} </span>`,
        },
      },
      icon: "info",
      button: "OK",
      dangerMode: true,
    });
  }


  useEffect(()=>{
    if (winPrice=== "10 Points" || winPrice==="100 Points") {
      let points;
      if (winPrice=== "10 Points") {
        points = parseInt(winPrice?.slice(0,2))
      }else{
        points = parseInt(winPrice?.slice(0,3))
      }
      const payload = {"points":points}
      axios.post("/api/update_points",payload).then(res=>{
       
      }).catch(err=>toast.error(err?.message))
    }
  },[winPrice])

  return (
    <>
      <div>
        {/* audio in wheel spin  */}
        {spinSound && (
          <div style={{ visibility: "hidden", position: "absolute" }}>
            <ReactPlayer
              url={spinAudioSound}
              playing={true}
              muted={false}
              controls={true}
              volume={0.5}
              width="100%"
              height="25vh"
            />
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center align-items-center  ">
        <div>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber} // Pass prizeNumber to the Wheel component
            data={data}
            onStopSpinning={(winner) => {
              setMustSpin(false);
              setWinPrice(selectData?.option);
              setSpinSound(false);
              setSpinCall(false);
            }}
            className="spinCss"
            outerBorderColor={"#b7800b"}
            outerBorderWidth={2}
            innerBorderWidth={20}
            // innerBorderColor={"#ffca2c"}
            radiusLineColor={"white"}
            radiusLineWidth={2}
            pointerProps={{
              src: roulettePointer, // Specify the image source for the pointer
              style: {
                // Apply CSS styling for the pointer
                transform: "rotate(45deg)",
                height: "100px",
                width: "80px",
                top: "30px",
                right: "20px",
                zIndex: 10,
              },
            }}
            textColors={[
              "white",
              "white",
              "white",
              "white",
              "white",
              "white",
              "white",
              "white",
              "white",
            ]}
          />{" "}
        </div>

        {/* outer gradient filed  */}
        <div
          className=""
          style={{
            // zIndex: 8,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "210px",
              zIndex: 5,
            }}
            className="spinCss"
          ></button>
        </div>

        {/* spin button outer gradient filed  */}
        <div
          className=""
          style={{
            zIndex: 10,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "35px",
              zIndex: 5,
              border: "7px solid transparent",
            }}
            className="spinCss"
          ></button>
        </div>

        {/* real button div 🆗*/}
        <div
          className=""
          style={{
            zIndex: 10,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            disabled={spinCountDetails?.free_spin === 0 || loading === true}
            onClick={handleSpinClick}
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              fontSize: "16px",
              padding: "5px",
              height: "55px",
              width: "55px",
              textAlign: "center",
            }}
            // className="spinCss"
          >
            SPIN
          </button>
        </div>

        {/* small round circle left 1 */}
        <div
          className=""
          style={{
            zIndex: 2,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              marginRight: "445px",
              zIndex: 5,
              borderImageSource:
                "linear-gradient(180deg, #272727 0%, #202020 17.5%, #393939 38.5%, #1E1E1E 60.5%, #2F2F2F 78%, #111111 100%)",
              borderImageSlice: "1", // You may adjust the slice value according to your needs
              border: "4px solid black", // Set the border to transparent to allow the gradient border to be visible
              background:
                "linear-gradient(180deg, #996900 6.5%, #FFF5C2 24.5%, #FFDE62 42.5%, #8A500E 60%, #521D00 76.5%, #D9A125 94%) border-box",
            }}
            className=""
          ></button>
        </div>
        {/* small round circle right 2 */}
        <div
          className=""
          style={{
            zIndex: 2,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              marginLeft: "445px",
              zIndex: 5,
              borderImageSource:
                "linear-gradient(180deg, #272727 0%, #202020 17.5%, #393939 38.5%, #1E1E1E 60.5%, #2F2F2F 78%, #111111 100%)",
              borderImageSlice: "1", // You may adjust the slice value according to your needs
              border: "4px solid black", // Set the border to transparent to allow the gradient border to be visible
              background:
                "linear-gradient(180deg, #996900 6.5%, #FFF5C2 24.5%, #FFDE62 42.5%, #8A500E 60%, #521D00 76.5%, #D9A125 94%) border-box",
            }}
            className=""
          ></button>
        </div>
        {/* small round circle top 3 */}
        <div
          className=""
          style={{
            zIndex: 2,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              marginBottom: "445px",
              zIndex: 5,
              borderImageSource:
                "linear-gradient(180deg, #272727 0%, #202020 17.5%, #393939 38.5%, #1E1E1E 60.5%, #2F2F2F 78%, #111111 100%)",
              borderImageSlice: "1", // You may adjust the slice value according to your needs
              border: "4px solid black", // Set the border to transparent to allow the gradient border to be visible
              background:
                "linear-gradient(180deg, #996900 6.5%, #FFF5C2 24.5%, #FFDE62 42.5%, #8A500E 60%, #521D00 76.5%, #D9A125 94%) border-box",
            }}
            className=""
          ></button>
        </div>
        {/* small round circle bottom 4 */}
        <div
          className=""
          style={{
            zIndex: 2,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              marginTop: "445px",
              zIndex: 5,
              borderImageSource:
                "linear-gradient(180deg, #272727 0%, #202020 17.5%, #393939 38.5%, #1E1E1E 60.5%, #2F2F2F 78%, #111111 100%)",
              borderImageSlice: "1", // You may adjust the slice value according to your needs
              border: "4px solid black", // Set the border to transparent to allow the gradient border to be visible
              background:
                "linear-gradient(180deg, #996900 6.5%, #FFF5C2 24.5%, #FFDE62 42.5%, #8A500E 60%, #521D00 76.5%, #D9A125 94%) border-box",
            }}
            className=""
          ></button>
        </div>
        {/* small round circle middle bottom right 5  */}
        <div
          className=""
          style={{
            zIndex: 2,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              marginTop: "320px",
              marginLeft: "320px",
              zIndex: 5,
              borderImageSource:
                "linear-gradient(180deg, #272727 0%, #202020 17.5%, #393939 38.5%, #1E1E1E 60.5%, #2F2F2F 78%, #111111 100%)",
              borderImageSlice: "1", // You may adjust the slice value according to your needs
              border: "4px solid black", // Set the border to transparent to allow the gradient border to be visible
              background:
                "linear-gradient(180deg, #996900 6.5%, #FFF5C2 24.5%, #FFDE62 42.5%, #8A500E 60%, #521D00 76.5%, #D9A125 94%) border-box",
            }}
            className=""
          ></button>
        </div>
        {/* small round circle middle bottom left 6  */}
        <div
          className=""
          style={{
            zIndex: 2,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              marginTop: "320px",
              marginRight: "320px",
              zIndex: 5,
              borderImageSource:
                "linear-gradient(180deg, #272727 0%, #202020 17.5%, #393939 38.5%, #1E1E1E 60.5%, #2F2F2F 78%, #111111 100%)",
              borderImageSlice: "1", // You may adjust the slice value according to your needs
              border: "4px solid black", // Set the border to transparent to allow the gradient border to be visible
              background:
                "linear-gradient(180deg, #996900 6.5%, #FFF5C2 24.5%, #FFDE62 42.5%, #8A500E 60%, #521D00 76.5%, #D9A125 94%) border-box",
            }}
            className=""
          ></button>
        </div>
        {/* small round circle middle top left  7 */}
        <div
          className=""
          style={{
            zIndex: 5,
            position: "absolute",
            marginRight: 50,
            marginLeft: 50,
            borderRadius: "50%",
          }}
        >
          <button
            style={{
              maxWidth: "max-content",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              padding: "5px",
              marginBottom: "320px",
              marginRight: "320px",
              zIndex: 5,
              borderImageSource:
                "linear-gradient(180deg, #272727 0%, #202020 17.5%, #393939 38.5%, #1E1E1E 60.5%, #2F2F2F 78%, #111111 100%)",
              borderImageSlice: "1", // You may adjust the slice value according to your needs
              border: "4px solid black", // Set the border to transparent to allow the gradient border to be visible
              background:
                "linear-gradient(180deg, #996900 6.5%, #FFF5C2 24.5%, #FFDE62 42.5%, #8A500E 60%, #521D00 76.5%, #D9A125 94%) border-box",
            }}
            className=""
          ></button>
        </div>
      </div>
      {/* text section  */}
      <div>
        <p
          className=" text-white"
          style={{ textAlign: "center", visibility: "hidden" }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          vestibulum elit non lacinia ultricies. Fusce auctor justo et velit
          facilisis, id commodo leo mollis.
        </p>
      </div>

      {selectData?.option && (
        <p
          style={{
            color: "#ffca2c",
            fontSize: 50,
            marginTop: 15,
            textAlign: "center",
          }}
        >
          {" "}
          {winPrice}
        </p>
      )}

      {/* won promo code   */}
      <div
        className="d-flex gap-2 justify-content-between align-items-center"
        style={{ marginTop: 10 }}
      >
        <div style={{ color: "white", fontSize: 30 }}>
          <span style={{ textAlign: "right" }}>
            Free Spin: {spinCountDetails?.free_spin}{" "}
          </span>{" "}
          <br />
          <span style={{ textAlign: "right" }}>
            Spin Count: {spinCountDetails?.spin_count}{" "}
          </span>
        </div>
      </div>
    </>
  );
};

export default SpinWheel;
