/*****TOP BAR BACKGROUND*****/
var topBar : Texture2D;

/**reference to MTL for variables ***/
var MTL : GameObject;

/*****TOP BAR LABELS*****/
var dozer_mode = "Auto";
var blade_load = "90%";
var temp_gps : Texture2D;

/*****BLINKING ANIMATION INITIALIZER*****/
var startTime;

/*****MACHINE HEALTH ICONS*****/
var fuel_white : Texture2D;
var fuel_red : Texture2D;
var hot_red : Texture2D;
var hot_white : Texture2D;
var tco_red : Texture2D;
var tco_white : Texture2D;
var ect_red : Texture2D;
var ect_white : Texture2D;
var health_temp : Texture2D;
var iconWidth : int = 32;
var iconHeight : int = 32;
var iconY : int = -3;
var fuel : float = 0.2;
var hot : float = 0.75;
var ect : float = 0.75;
var tco : float = 0.75;

/*****MACHINE PERFORMANCE GAUGES*****/
var temp_gauges : Texture2D;
var marker : Texture2D;
var GS_layer1 : Texture2D;
var GS_layer2 : Texture2D;
var GS_layer3 : Texture2D;
var TS_layer1 : Texture2D;
var TS_layer2 : Texture2D;
var TS_left_layer3 : Texture2D;
var TS_right_layer3 : Texture2D;

var GS_stopAngle : float = -230.0;
var GS_topAngle : float = 45.0;

var TS_stopAngle : float = -220.0;
var TS_topAngle : float = 45.0;

/*****PITCH AND ROLL ICONS*****/
var pitch_front : Texture2D;
var roll_front : Texture2D; 
var pitch_roll_back : Texture2D;
var pitch_roll_overlay : Texture2D;

/*****DROP DOWN MENU*****/
private var showList = false;
private var showList2 = false;
private var showList3 = false;

private var showBars = false;

private var camListEntry = 2;
private var disListEntry = 7;
private var avoListEntry = 3;
private var subEntry = 0;
private var list : GUIContent[];
private var list2 : GUIContent[];
private var list3 : GUIContent[];
private var listStyle : GUIStyle;
private var pickedCam = false;
private var pickedDis = false;
private var pickedAvo = false;

private var barsEntry = 0;
private var bars : GUIContent[];
private var barsStyle : GUIStyle;
private var bkgStyle : GUIStyle;

var checked : Texture2D;
var unchecked : Texture2D;
var arrow : Texture2D;

var testAngle = 0;

function Start () {
// Make some content for the popup list
    //**********************Camera**********************//
	/*list = new GUIContent[1];
    list[0] = new GUIContent(camera_menu);*/
    list = new GUIContent[4];
    list[0] = new GUIContent("Camera View			   >>");
    list[1] = new GUIContent("Camera Movement	   >>");
    list[2] = new GUIContent("-----------------------------------");
	list[3] = new GUIContent("Camera Reset");

//**********************Display**********************//
	/*list2 = new GUIContent[1];
    list2[0] = new GUIContent(display_menu);*/
	list2 = new GUIContent[9];
    list2[0] = new GUIContent(" Grid", unchecked);
    list2[1] = new GUIContent(" Avoidance Zone", checked);
    list2[2] = new GUIContent(" E-Fence", checked);
    list2[3] = new GUIContent(" 2D View", unchecked);
    list2[4] = new GUIContent(" Work Plan", checked);
	list2[5] = new GUIContent(" Split Screen", unchecked);
    list2[6] = new GUIContent(" Track Animation", checked);
	list2[7] = new GUIContent("-----------------------------------");
	list2[8] = new GUIContent("Surface Color			   >>");
    
//**********************Avoidance Zone**********************//
	/*list3 = new GUIContent[1];
    list3[0] = new GUIContent(avoidance_menu);*/
	list3 = new GUIContent[4];
    list3[0] = new GUIContent(" Beginner", checked);
    list3[1] = new GUIContent(" Intermediate",unchecked);
    list3[2] = new GUIContent(" Advanced", unchecked);
	list3[3] = new GUIContent("");
	
//**********************Machine Health**********************//
	bars = new GUIContent[1];
    bars[0] = new GUIContent(health_temp);
	
    // Make a GUIStyle that has a solid white hover/onHover background to indicate highlighted items
    listStyle = new GUIStyle();
    listStyle.normal.textColor = Color.white;
	listStyle.hover.textColor = Color.white;
	listStyle.onHover.textColor = Color.white;
	//listStyle.fixedWidth = 262;
	
	var tex = new Texture2D(1, 1);
	tex.SetPixel(0, 0, Color(0.2f,0.2f,0.2f,1f));
	tex.SetPixel(0, 1, Color(0.2f,0.2f,0.2f,1f));
	tex.SetPixel(1, 0, Color(0.2f,0.2f,0.2f,1f));
	tex.SetPixel(1, 1, Color(0.2f,0.2f,0.2f,1f));
	tex.Apply();

	var tex2 = new Texture2D(1, 1);
	tex2.SetPixel(0, 0, Color(0.2f,0.2f,0.2f,0f));
	tex2.SetPixel(0, 1, Color(0.2f,0.2f,0.2f,0f));
	tex2.SetPixel(1, 0, Color(0.2f,0.2f,0.2f,0f));
	tex2.SetPixel(1, 1, Color(0.2f,0.2f,0.2f,0f));
	tex2.Apply();
	
    listStyle.hover.background = tex;
    listStyle.onHover.background = tex;
    listStyle.padding.left = listStyle.padding.right = listStyle.padding.top = listStyle.padding.bottom = 4;
	
	barsStyle = new GUIStyle();
    barsStyle.normal.background = tex2;
	
	bkgStyle = new GUIStyle();
	bkgStyle.normal.background = tex;
}


function Awake() {

   startTime = Time.time;

}


function OnGUI () {

/*****TOP BAR BACKGROUND*****/
GUI.DrawTexture(Rect(0,0,Screen.width,28),topBar);


/*****TIME CLOCK CALCULATIONS FOR BLINKING ANIMATION*****/

var guiTime = Time.time - startTime;
var minutes : int = guiTime / 60;
var seconds : int = guiTime % 60;
var fraction : int = (guiTime * 100) % 100;

if (seconds > 10) {
	hot = 0.26;
}
if (seconds > 15) {
	tco=0.26;
}



/*****GROUND SPEED CALCULATIONS AND DISPLAY*****/

var gps_data : Vector3 = MTL.GetComponent("MTLDataLoad").packet.Pos; // DATA POINT

var gpsPos1 : Vector3 = MTL.GetComponent("MTLDataLoad").packet.GPS1;//Vector3(465430927, 750262748, 126178); // First DATA POINT	(gps_north, gps_east, gps_elevation)  -> gps_data
var gpsPos2 : Vector3 = MTL.GetComponent("MTLDataLoad").packet.GPS2;//Vector3(465430928, 750262747, 126176); // Next DATA POINT (gps_north, gps_east, gps_elevation) -> gps_data
var dist = Vector3.Distance(gpsPos1, gpsPos2);



/*****************************************
** WILL NEED time_stamp DATA POINT**
*****************************************/
//print("Distance: " + dist + " mm/s");

GUI.DrawTexture(Rect(Screen.width - 155,Screen.height  - 155,150,150), GS_layer1); // Layer 1

var GS_kmh : float = 3.0;
var GS_speedFraction = GS_kmh/GS_topAngle;

var matrixBackup:Matrix4x4  = GUI.matrix;
var GS_markerAngle :float = Mathf.Lerp(GS_stopAngle,GS_topAngle,GS_speedFraction); 
//print(GS_markerAngle);
var GS_markerCenter:Vector2 = Vector2(Screen.width - (155/2)-5, Screen.height - (155/2)-5);

GUIUtility.RotateAroundPivot(GS_markerAngle, GS_markerCenter);
GUI.DrawTexture(Rect(Screen.width - (155/2)-5, (Screen.height - (155/2)-5)-9,73,20), marker);     // Marker
GUI.matrix = matrixBackup; 

GUI.DrawTexture(Rect(Screen.width - 155,Screen.height  - 155,150,150), GS_layer2); // Layer 2
GUI.DrawTexture(Rect(Screen.width - 155,Screen.height  - 155,150,150), GS_layer3); // Layer 3

/*****TRACK SPEED CALCULATIONS AND DISPLAY*****/
var TS_left_motor : float = MTL.GetComponent("MTLDataLoad").packet.trackSpeed.x;		// DATA POINT
var TS_right_motor : float = MTL.GetComponent("MTLDataLoad").packet.trackSpeed.y; 	// DATA POINT



var TS_leftRPM : float = (((0.5 * TS_left_motor))) * 0.01 ;
print(TS_leftRPM);
if (TS_leftRPM < 0)
	TS_leftRPM *= -1;
var TS_leftSpeedFraction = (TS_leftRPM/TS_topAngle);
print("speed fraction " + TS_leftSpeedFraction);

var TS_rightRPM : float = (((0.5 * TS_right_motor)))* 0.01;
if (TS_rightRPM < 0)
	TS_rightRPM *= -1;
var TS_rightSpeedFraction = (TS_leftRPM/TS_topAngle);

GUI.DrawTexture(Rect(Screen.width - 340,Screen.height  - 95,90,90), TS_layer1); // Left Track RPM

var TS_leftMarkerAngle :float = Mathf.Lerp(TS_stopAngle,TS_topAngle,TS_leftSpeedFraction);
print("marker angle " + TS_leftMarkerAngle);

var TS_leftMarkerCenter:Vector2 = Vector2((Screen.width - 250) - 45, (Screen.height - 95) + 45);
GUIUtility.RotateAroundPivot(TS_leftMarkerAngle, TS_leftMarkerCenter);
GUI.DrawTexture(Rect((Screen.width - 250) - 45, ((Screen.height - 90)+45)-12.5,41,13), marker);     // Marker
GUI.matrix = matrixBackup; 

GUI.DrawTexture(Rect(Screen.width - 340,Screen.height  - 95,90,90), TS_layer2); 
GUI.DrawTexture(Rect(Screen.width - 340,Screen.height  - 95,90,90), TS_left_layer3);


GUI.DrawTexture(Rect(Screen.width - 246,Screen.height  - 95,90,90), TS_layer1); // Right Track RPM

var TS_rightMarkerAngle :float = Mathf.Lerp(TS_stopAngle,TS_topAngle,TS_rightSpeedFraction); 
var TS_rightMarkerCenter:Vector2 = Vector2((Screen.width - 156) - 45, (Screen.height - 95) + 45);
GUIUtility.RotateAroundPivot(TS_rightMarkerAngle, TS_rightMarkerCenter);
GUI.DrawTexture(Rect((Screen.width - 156) - 45, ((Screen.height - 90)+45)-12.5,41,13), marker);     // Marker
GUI.matrix = matrixBackup; 

GUI.DrawTexture(Rect(Screen.width - 246,Screen.height  - 95,90,90), TS_layer2); 
GUI.DrawTexture(Rect(Screen.width - 246,Screen.height  - 95,90,90), TS_right_layer3); 

//GUI.Button(Rect((Screen.width - 156) - 45, (Screen.height - 95) + 45,5,5),""); // center test


/*****PITCH AND ROLL CALCULATIONS AND DISPLAY*****/

GUI.DrawTexture(Rect(5,Screen.height - 105,100,100), pitch_roll_back);
GUI.DrawTexture(Rect(115,Screen.height - 105,100,100), pitch_roll_back);

var pitch_roll_rate : Vector3 = MTL.GetComponent("MTLDataLoad").packet.pitchRollRate;	// DATA POINT

var pitchX : float =  ((pitch_roll_rate.x - 32000) * 2) * 0.00001;
var rollX : float =  ((pitch_roll_rate.y - 32000) * 2) * 0.00001;

var pitchAngle:float = ((pitch_roll_rate.x-32000)*2)*0.0001;
var pitchPos:Vector2 = Vector2(55,Screen.height - 55);
GUIUtility.RotateAroundPivot(pitchAngle, pitchPos);
GUI.DrawTexture(Rect(5,Screen.height - 105,100,100), pitch_front);      
GUI.matrix = matrixBackup;

var rollAngle:float =   ((pitch_roll_rate.y-32000)*2)*0.0001;
var rollPos:Vector2 = Vector2(170,Screen.height - 55);
GUIUtility.RotateAroundPivot(rollAngle, rollPos);
GUI.DrawTexture(Rect(115,Screen.height - 105,100,100), roll_front);      
GUI.matrix = matrixBackup;

GUI.DrawTexture(Rect(115,Screen.height - 105,100,100), pitch_roll_overlay);
GUI.DrawTexture(Rect(5,Screen.height - 105,100,100), pitch_roll_overlay);


/*****MACHINE HEALTH ICON CALCULATIONS AND DISPLAY*****/
if (HealthDropDown.Bars (Rect(Screen.width - 142,iconY,134,32), showBars, barsEntry, GUIContent(""), bars, barsStyle)) {
        picked = true;
    }
    //if (picked) {
        //GUI.Label (Rect(50, 70, 400, 20), "You picked " + list3[listEntry].text + "!");
    //}
	
if (fuel <= 0.5) {
	GUI.DrawTexture(Rect(Screen.width - 142,iconY,iconWidth,iconHeight), fuel_white);
}
else if (fuel < 0.4) {
	if ((seconds % 2 )== 0) {
		GUI.DrawTexture(Rect(Screen.width - 142,iconY,iconWidth,iconHeight), fuel_red);
	}
	else {
		GUI.DrawTexture(Rect(Screen.width - 142,iconY,iconWidth,iconHeight), fuel_white);
	}
}

if (hot < 0.8 && hot > 0.4) {
	GUI.DrawTexture(Rect(Screen.width -108,iconY,iconWidth,iconHeight), hot_white);
}
else if (hot >= 0.8 || hot <=0.4) {
	if ((seconds % 2 )== 0) {
		GUI.DrawTexture(Rect(Screen.width - 108,iconY,iconWidth,iconHeight), hot_red);
	}
	else {
		GUI.DrawTexture(Rect(Screen.width - 108,iconY,iconWidth,iconHeight), hot_white);
	}
}

if (ect < 0.8 && ect > 0.4) {
	GUI.DrawTexture(Rect(Screen.width - 74,iconY,iconWidth,iconHeight), ect_white);
}
else if (ect >= 0.8 || ect <=0.4){
	if ((seconds % 2 )== 0) {
		GUI.DrawTexture(Rect(Screen.width - 74,iconY,iconWidth,iconHeight), ect_red);
	}
	else {
		GUI.DrawTexture(Rect(Screen.width - 74,iconY,iconWidth,iconHeight), ect_white);
	}
}

if (tco < 0.8 && tco > 0.4) {
	GUI.DrawTexture(Rect(Screen.width - 40,iconY,iconWidth,iconHeight), tco_white);
}
else if (tco >= 0.8 || tco <=0.4){
	if ((seconds % 2 )== 0) {
		GUI.DrawTexture(Rect(Screen.width - 40,iconY,iconWidth,iconHeight), tco_red);
	}
	else {
		GUI.DrawTexture(Rect(Screen.width - 40,iconY,iconWidth,iconHeight), tco_white);
	}
}



/*****TOP MENU BAR LABELS*****/
GUI.Label(Rect((Screen.width/2) - 210,0,465,28), "", bkgStyle);
GUI.Label(Rect((Screen.width/2) - 200,4,350,25), "GPS: ");
GUI.DrawTexture(Rect((Screen.width/2) - 160,1,32,26), temp_gps);
GUI.Label(Rect((Screen.width/2) - 45,4,350,25), "Dozer Mode: " + dozer_mode);
GUI.Label(Rect((Screen.width/2) + 145,4,350,25), "Blade Load: " + blade_load);



/*****DROP DOWN MENU BUTTONS*****/
if (DropDown.List (Rect(15,6,55,26), showList, camListEntry, GUIContent("Camera"), list, listStyle, subEntry)) {
        pickedCam = true;
    }
if (pickedCam) {
        //GUI.Label (Rect(50, 70, 400, 20), "You picked " + list[listEntry].text + "!");
		//print(listEntry);
		//GUI.DrawTexture(Rect(2, 29,tco_white.width, tco_white.height),tco_white);
}

if (DropDown.List (Rect(90,6,55,26), showList2, disListEntry, GUIContent("Display"), list2, listStyle, subEntry)) {
        pickedDis = true;
    }
	if (pickedDis) {
		pickedDis = false;
        //GUI.Label (Rect(50, 70, 400, 20), "You picked " + list2[listEntry].text + "!");
    }
	
if (DropDown.List (Rect(160,6,106,26), showList3, avoListEntry, GUIContent("Avoidance Zone"), list3, listStyle, subEntry)) {
        pickedAvo = true;
    }
    if (pickedAvo) {
		pickedAvo = false;
        //GUI.Label (Rect(50, 70, 400, 20), "You picked " + list3[listEntry].text + "!");
    }

}