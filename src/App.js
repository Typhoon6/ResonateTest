import logo from './logo.svg';
import './App.css';

// First two characters can be identifiers: 
// a-z = 26 characters, A-Z = 26 characters, 0-9 = 10 characters = 62 characters
// Other characters possible but must consider the user reading/copying
// Having special characters makes it more difficult than these 62 characters

// Help indicate the company name -> first two characters are Capital characters
// 26*26 = 676 possibilities

// If 200 store branches with max 10,000 customers
// --> 200*10000 = 2,000,000 max people a day
// Unique Identifier for singular person should be atleast 4 characters
// 62^2 = 3,844
// 62^3 = 238,328
// 62^4 = 14,776,336
// 62^3 * 10 = 2,383,280

// Date has 3 remaining characters:
// Max day is 31 so A-Za-Z0-9
// Max month is 12 so A-Za-z0-9
// Year is 4 digit long --> since ticket is initialised time we can limit the year field

// Total: 9 characters
// Company (2): [A-Z],[A-Z]
// Identifier (4): [0-9], [A-Za-z0-9], [A-Za-z0-9], [A-Za-z0-9]
// Date (3): [A-Za-z0-9], [A-Za-z0-9], [A-Za-z0-9]

// TODO: Modify this function
function generateShortCode(storeId, transactionId) {
    
    // ============================================================
    // ============================================================
    // StoreID: [1-200], A-Z,A-Z
    let div = 65 + Math.floor(storeId/26); // 65 is ASCII A
    let mod = 65 + storeId%26;
    /* div will determine first character, mod will be the second character
       and convert the number to a ASCII code */
    
    // Caesar cipher both to slightly improve security (one up 3 and one down 5)
    let caesar_shift_div = String.fromCharCode(((div + 3) % 26) + 65);
    let caesar_shift_mod = String.fromCharCode(((mod + 21) % 26) + 65);
    //console.log(div + " " + conv_div + " " + mod + " " + conv_mod);

    let storeCode = caesar_shift_div + caesar_shift_mod;
    // ============================================================
    // ============================================================
    // TransactionId: [0-9], [A-Za-z0-9], [A-Za-z0-9], [A-Za-z0-9]
    // 0 - 2,000,000

    let tran1 = transactionId%62;
    let tran2 = Math.floor(transactionId/(62))%62;
    let tran3 = Math.floor(transactionId/(62*62))%62;
    let tran4 = Math.floor(transactionId/(62*62*62));

    let t1code = convert_num_to_alpha(tran1);
    let t2code = convert_num_to_alpha(tran2);
    let t3code = convert_num_to_alpha(tran3);
    let t4code = tran4;

    //console.log("tranID: " + transactionId + " tran1 + tran2 + tran3 + tran4")
    /*console.log(tran1 + ":" + t1code + " " + 
                tran2 + ":" + t2code + " " + 
                tran3 + ":" + t3code + " " + 
                tran4 + ":" + Math.floor(transactionId/(62*62*62)));*/

    let transactionCode = t4code + t3code + t2code + t1code;
    // ============================================================
    // ============================================================
    // DateID:
    let dateCode = ""; 
    let day = new Date();
    let daycode = convert_date_to_code(day.getDate());
    let mthcode = convert_date_to_code(day.getMonth());
    let yr_end_digits = day.getFullYear().toString().slice(-2);
    let yercode = convert_date_to_code(parseInt(yr_end_digits));

    //console.log(daycode + " " + mthcode + " " + yercode);
    dateCode = daycode + mthcode + yercode;
    // ============================================================
    // ============================================================

    return storeCode + transactionCode + dateCode;
}


function convert_date_to_code(num) {
    if (num < 10) {
        return num.toString();
    } else if (num < 20) {
        return String.fromCharCode(num + 55);
    } else {
        return String.fromCharCode(num + 77);
    }
}

// Shift the different characters by a number
function convert_num_to_alpha(num) {
    if (num < 26) {
        return String.fromCharCode(((num)) + 97); // a-z
    } else if (num < 52) {
        return String.fromCharCode(((num)) + 39); // A-Z
    } else {
        return String.fromCharCode(((num)) - 4); // 0-9
    }
}

function isNumeric(val) {
    return /^-?\d+$/.test(val);
}
function revert_num_to_alpha(character) {
    if (isNumeric(character)) {
        return parseInt(character.charCodeAt(0)) + 4; // 0-9
    } else if (character === character.toLowerCase()) {
        return parseInt(character.charCodeAt(0) - 97); // a-z
    } else if (character === character.toUpperCase()) {
        return parseInt(character.charCodeAt(0) - 39); // A-Z
    } else {
        return parseInt(character.charCodeAt(0)) + 4; // 0-9
    }
}
function revert_date_to_code(character) {
    if (isNumeric(character)) {
        return parseInt(character);
    } else if (character === character.toUpperCase()) {
        return parseInt(character.charCodeAt(0) - 55);
    } else if (character === character.toLowerCase()){
        return parseInt(character.charCodeAt(0) - 77);
    } else {
        return character;
    }
}

// TODO: Modify this function
function decodeShortCode(shortCode) {
    // Logic goes here

    // Reverse Store and Caesar Cipher
    let reverse_c1 = ((shortCode.charCodeAt(0) + (26 - 3)) % 26)
    let reverse_c2 = ((shortCode.charCodeAt(1) + (26 - 21)) % 26)
    let decode_storeid = reverse_c1*26 + reverse_c2;

    // Reverse Transaction ID
    let reverse_c3 = shortCode.charAt(2);
    let reverse_c4 = shortCode.charAt(3);
    let reverse_c5 = shortCode.charAt(4);
    let reverse_c6 = shortCode.charAt(5);

    //console.log(reverse_c3 + " " + reverse_c4 + " " + reverse_c5 + " " + reverse_c6);

    let transactionID = revert_num_to_alpha(reverse_c6) +
                        revert_num_to_alpha(reverse_c5)*62 +
                        revert_num_to_alpha(reverse_c4)*62*62 + 
                        parseInt(reverse_c3)*62*62*62;

    /*console.log(revert_num_to_alpha(reverse_c3) + " | " + 
                revert_num_to_alpha(reverse_c4) + " | " + 
                revert_num_to_alpha(reverse_c5) + " | " + 
                revert_num_to_alpha(reverse_c6) );

    console.log(transactionID)*/

    // Reverse Date
    let reverse_c7 = shortCode.charAt(6);
    let reverse_c8 = shortCode.charAt(7);
    let reverse_c9 = shortCode.charAt(8);

    let date = revert_date_to_code(reverse_c7);
    let month = revert_date_to_code(reverse_c8);
    let year = "20" + revert_date_to_code(reverse_c9);
    // Assumes new date won't be next century and within the 20XX
    let new_date = new Date(year, month, date);

    return {
        storeId: decode_storeid, // store id goes here,
        shopDate: new_date, // the date the customer shopped,
        transactionId: transactionID, // transaction id goes here
    };
}

// Note: had to change a bit in run tests and add testresult so it can run properly with React

// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [175, 42, 0, 9]
    var transactionIds = [9675, 23, 123, 7]

    //var storeIds = [100]
    //var transactionIds = [0, 1, 20, 40, 61, 62, 100, 120, 300, 4000, 4500, 238326, 720000, 1500000]

    console.log(transactionIds);

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            document.getElementById("test-results").innerHTML += ("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    document.getElementById("test-results").innerHTML += ("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}


const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
;
function transformToUpperCase(str, separators) {
  separators = separators || [ ' ' ];
  var regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
  return str.toLowerCase().replace(regex, function(x) { return x.toUpperCase(); });
}

function open_contacts() {
    document.getElementById("contact_list").innerHTML = "";
    const url = "https://jsonplaceholder.typicode.com/users";

    fetch(url)
        .then(response => response.json())
        .then(data => { 
            console.log(data);

            let contact_block = document.createElement('div');
            for (let i = 0; i < data.length; i++) {
                let contact = data[i];
                let contact_details = document.createElement('div');
                contact_details.className = "contact_details_block";

                let c_text_det = document.createElement('div');
                c_text_det.className = "contact_text_details";
                let c_img_det = document.createElement('div');
                c_img_det.className = "contact_img_details";

                let c_img = document.createElement('div');
                let c_img_text = document.createElement('p');
                c_img_text.innerText = contact.name.charAt(0);
                c_img.className = "contact_img cimg_col_" + contact.name.charAt(0).toLowerCase();
                c_img_text.className = "contact_img_text";
                c_img.appendChild(c_img_text);

                


                let c_name = document.createElement('div');
                c_name.innerText = contact.name;
                c_name.className = "contact_name";

                let c_username = document.createElement('div');
                c_username.innerText = "@" + contact.username;
                c_username.className = "contact_user";

                let pew = document.createElement('div');
                pew.className = "pew";
                let c_phone = document.createElement('div');
                let phone_title = document.createElement('span');
                phone_title.className = "det_title";
                phone_title.innerText = "P: "
                let phone_val = document.createElement('span');
                phone_val.className = "det_name";
                phone_val.innerText = contact.phone;
                c_phone.appendChild(phone_title);
                c_phone.appendChild(phone_val);


                let c_email = document.createElement('div');
                let email_title = document.createElement('span');
                email_title.className = "det_title";
                email_title.innerText = "E: "
                let email_val = document.createElement('span');
                email_val.className = "det_name";
                email_val.innerText = contact.email;
                c_email.appendChild(email_title);
                c_email.appendChild(email_val);


                let c_website = document.createElement('div');
                let web_title = document.createElement('span');
                web_title.className = "det_title";
                web_title.innerText = "W: "
                let web_val = document.createElement('span');
                web_val.className = "det_name";
                web_val.innerText = contact.website;
                c_website.appendChild(web_title);
                c_website.appendChild(web_val);

                pew.appendChild(c_phone);
                pew.appendChild(c_email);
                pew.appendChild(c_website);

                let c_com_add = document.createElement('div');
                c_com_add.className = "contact_comadd_block";

                let c_company = document.createElement('div');
                c_company.className = "contact_company_block";

                let comp_title = document.createElement('div');
                comp_title.className = "company_title";
                let comp_title_ = document.createElement('div');
                comp_title_.className = "comp_title";
                comp_title_.innerText = "Company: ";
                let comp_name = document.createElement('div');
                comp_name.className = "comp_name";
                comp_name.innerText = contact.company.name;

                
                comp_title.appendChild(comp_title_);
                comp_title.appendChild(comp_name);

                let catch_bs = document.createElement('div');
                let c_catchphrase = document.createElement('div');
                let cp = transformToUpperCase(contact.company.catchPhrase, ['-']);
                c_catchphrase.innerText = `"` + capitalize(cp) + `"`;
                c_catchphrase.className = "comp_catch";

                let c_bs = document.createElement('div');
                let bs = transformToUpperCase(contact.company.bs, ['-']);
                c_bs.innerText = capitalize(bs);;
                c_bs.className = "comp_bs";

                catch_bs.style.display = "none";
                catch_bs.appendChild(c_catchphrase);
                catch_bs.appendChild(c_bs);

                let temp = 0;

                comp_title.onclick = function(){
                    if (temp === 0) {
                        temp = 1;
                        comp_name.style.color = "rgb(16, 168, 172)";
                        catch_bs.style.display = "block";
                        comp_title.style.backgroundImage = "url(https://www.svgrepo.com/show/182829/compress.svg)";
                    } else {
                        temp = 0;
                        //comp_title.style.backgroundColor = "rgb(57,65,101)";
                        comp_name.style.color = "rgb(145,153,189)";
                        catch_bs.style.display = "none";
                        comp_title.style.backgroundImage = "url(https://www.svgrepo.com/show/256961/expand.svg)";
                    }
                }


                c_company.appendChild(comp_title);
                c_company.appendChild(catch_bs);

                


                let c_address = document.createElement('div');
                c_address.className = "contact_address_block";

                let addstreet = document.createElement('div');
                addstreet.className = "addstreet"
                let address = document.createElement('div');
                address.innerText = "Address:"
                address.className = "add_title add_size";
                let street = document.createElement('div');
                street.innerText = contact.address.suite + ", " + contact.address.street;
                street.className = "add_name add_size2";

                addstreet.appendChild(address);
                addstreet.appendChild(street);

                let czg = document.createElement('div');
                czg.style.display = "none";

                let city = document.createElement('div');
                let city_title = document.createElement('div');
                city_title.className = "add_title";
                city_title.innerText = "City: ";
                let city_name = document.createElement('div');
                city_name.className = "add_name";
                city_name.innerText = contact.address.city;
                city.appendChild(city_title);
                city.appendChild(city_name);

                let zipcode = document.createElement('div');
                let zip_title = document.createElement('div');
                zip_title.className = "add_title";
                zip_title.innerText = "Zip Code: ";
                let zip_name = document.createElement('div');
                zip_name.className = "add_name";
                zip_name.innerText = contact.address.zipcode;
                zipcode.appendChild(zip_title);
                zipcode.appendChild(zip_name);

                let geo = document.createElement('div');
                let geo_lat_title = document.createElement('span');
                geo_lat_title.innerText = "Lat: ";
                geo_lat_title.className = "add_title";
                let geo_lat_val = document.createElement('span');
                geo_lat_val.innerText = contact.address.geo.lat;
                geo_lat_val.className = "add_name";
                let geo_lng_title = document.createElement('span');
                geo_lng_title.innerText = "Lng: ";
                geo_lng_title.className = "add_title lng_pad";
                let geo_lng_val = document.createElement('span');
                geo_lng_val.innerText = contact.address.geo.lat;
                geo_lng_val.className = "add_name";
                geo.appendChild(geo_lat_title);
                geo.appendChild(geo_lat_val);
                geo.appendChild(geo_lng_title);
                geo.appendChild(geo_lng_val);

                czg.appendChild(city);
                czg.appendChild(zipcode);
                czg.appendChild(geo);

                let temp2 = 0;
                addstreet.onclick = function(){
                    if (temp2 === 0) {
                        temp2 = 1;
                        street.style.color = "rgb(16, 168, 172)";
                        czg.style.display = "block";
                        addstreet.style.backgroundImage = "url(https://www.svgrepo.com/show/182829/compress.svg)";
                    } else {
                        temp2 = 0;
                        street.style.color = "rgb(145,153,189)";
                        czg.style.display = "none";
                        addstreet.style.backgroundImage = "url(https://www.svgrepo.com/show/256961/expand.svg)";
                    }
                }

                c_address.appendChild(addstreet);
                c_address.appendChild(czg);

                c_com_add.appendChild(c_company);
                c_com_add.appendChild(c_address);


                c_img_det.appendChild(c_img);
                c_text_det.appendChild(c_name);
                c_text_det.appendChild(c_username);
                c_text_det.appendChild(pew);
                c_text_det.appendChild(c_com_add);
                contact_details.appendChild(c_img_det);
                contact_details.appendChild(c_text_det);
                

                contact_block.appendChild(contact_details); 
                
            }
            
            document.getElementById("contact_list").appendChild(contact_block);
        })
        .catch(err => {console.log(err);
        });

}


function task1() {
    document.getElementById("opening_screen_btns").style.display = "none";
    document.getElementById("task1_section").style.display = "block";
    document.getElementById("resonate_header_btns").style.display = "flex";
    document.getElementById("task2_section").style.display = "none";
        

}
const task2 = () => {
    document.getElementById("opening_screen_btns").style.display = "none";
    document.getElementById("task2_section").style.display = "block";
    document.getElementById("resonate_header_btns").style.display = "flex";
    document.getElementById("task1_section").style.display = "none";
    open_contacts();
}

function App() {
  return (
    <div className="App">

        <div id="resonate_header">
            <div id="resonate_header_btns">
                <button id="head_task1" className="res_task_btn" onClick={task1}>Task 1</button>
                <button id="head_task2" className="res_task_btn" onClick={task2}>Task 2</button>
            </div>
            <div id="resonate_header_btns_small">
                <button id="head_task11" className="res_task_btn small_btn" onClick={task1}>1</button>
                <button id="head_task22" className="res_task_btn small_btn" onClick={task2}>2</button>
            </div>
        </div>

        <div id="opening_screen_btns">
            <div><button className="res_task_btn open_screen_btn" onClick={task1}>Task 1</button></div>
            <div><button className="res_task_btn open_screen_btn" onClick={task2}>Task 2</button></div>
        </div>

        <div id="task1_section">
            <div>Run the tests</div>
            <button onClick={RunTests}>Run Tests</button>
            <h3>Test results:</h3>
            <div id="test-results"></div>
        </div>

        <div id="task2_section">
            <div id="contacts_header">Contacts</div>
            <div id="flex_contact_list">
                <div id="contact_list"/>
            </div>
            
        </div>

        
      

    </div>
  );
}

export default App;
