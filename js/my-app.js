var fs_from_spending_dateCal;
var fs_to_spending_dateCal;
var monthZeroedArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
var isLeftPanelOpen = false;

// Initialize your app
var myApp = new Framework7({
    swipePanel: 'left',
    modalTitle: 'DavestPay.Com Officer',
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// database
if (window.openDatabase) {
  var mydb = openDatabase("budget_me", "0.1", "DavestPay Officer DB", 1024 * 1024 * 50);

  mydb.transaction(function (t) {
    t.executeSql("CREATE TABLE IF NOT EXISTS spending (id INTEGER PRIMARY KEY ASC, name, brand, location, descr, spent, spending_date, is_del, upd_date)");
    t.executeSql("CREATE TABLE IF NOT EXISTS budget (month_year PRIMARY KEY, budget, is_del, upd_date)");
    t.executeSql("CREATE TABLE IF NOT EXISTS name (name PRIMARY KEY)");
    t.executeSql("CREATE TABLE IF NOT EXISTS brand (name PRIMARY KEY)");
    t.executeSql("CREATE TABLE IF NOT EXISTS location (name PRIMARY KEY)");
  });
} else {
  myApp.alert("Not supported on your phone.");
}

// enable BACK button
$$('.panel-left').on('opened', function () {
  isLeftPanelOpen = 1;
});
$$('.panel-left').on('close', function () {
  isLeftPanelOpen = 0;
});

document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(e) {
  if (isLeftPanelOpen==1) {
    myApp.closePanel();
    isLeftPanelOpen = 0;
  } else if ($$('.view-main').data('page')!=='index') {
    mainView.router.back();
  } else {
    navigator.app.exitApp();
  }
  
  e.preventDefault();
}

// check whether empty
function isEmpty(value) {
  if (typeof value === 'undefined' || value.trim()==='')
    return true;
  return false;
}

// autocomplete
function setAutoComplete(t, tableName, selectorLabel) {
  t.executeSql("SELECT * FROM " + tableName + " ORDER BY name", [], function (transaction, results) {
    var availableTags = [];
    for (i=0; i<results.rows.length; i++) 
      availableTags.push(results.rows.item(i).name);
    $(selectorLabel).autocomplete({
      delay: 0,
      source: availableTags
    });
  });
}

// input for number only
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}
function numberWithCommas(x) {
    //remove commas
    retVal = x ? parseFloat(x.replace(/,/g, '')) : 0;
    if (retVal==0) return '';

    //apply formatting
    return retVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// format date
function getFormattedDate(dateYmd) {
  var d = new Date(dateYmd);

  var day = d.getDay();
  var date = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();

  var dayStr = '';
  switch (day) {
    case 0:
        dayStr = "Minggu";
        break;
    case 1:
        dayStr = "Senin";
        break;
    case 2:
        dayStr = "Selasa";
        break;
    case 3:
        dayStr = "Rabu";
        break;
    case 4:
        dayStr = "Kamis";
        break;
    case 5:
        dayStr = "Jum'at";
        break;
    case 6:
        dayStr = "Sabtu";
        break;
  } 

  var monthStr = '';
  switch (month) {
    case 0:
      monthStr = 'Januari';
      break;
    case 1:
      monthStr = 'Februari';
      break;
    case 2:
      monthStr = 'Maret';
      break;
    case 3:
      monthStr = 'April';
      break;
    case 4:
      monthStr = 'Mei';
      break;
    case 5:
      monthStr = 'Juni';
      break;
    case 6:
      monthStr = 'Juli';
      break;
    case 7:
      monthStr = 'Agustus';
      break;
    case 8:
      monthStr = 'September';
      break;
    case 9:
      monthStr = 'Oktober';
      break;
    case 10:
      monthStr = 'November';
      break;
    case 11:
      monthStr = 'Desember';
      break;
  }

  return dayStr+', '+date+' '+monthStr+' '+year;
}

// add 0 to number -- 2 digits
Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

// format date to yyyy-MM-dd hh:mm:ss
function getFormattedDateYMDHMS (d) {
  return [d.getFullYear(),
              (d.getMonth()+1).padLeft(),
               d.getDate().padLeft(),
               ].join('-') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');
}

// format date to yyyy-MM-dd
function getFormattedDateYMD(d) {
  return [d.getFullYear(),
              (d.getMonth()+1).padLeft(),
               d.getDate().padLeft(),
               ].join('-');
}

// format date to yyyy-MM
function getFormattedDateYM(d) {
  return [d.getFullYear(),
              (d.getMonth()+1).padLeft()]
              .join('-');
}

// e.g.: January, February, and so on...
function getMonthString(month) {
  var monthStr = '';
  var monthNumber = Number(month);

  switch (monthNumber) {
    case 1:
        monthStr = "January";
        break;
    case 2:
        monthStr = "February";
        break;
    case 3:
        monthStr = "March";
        break;
    case 4:
        monthStr = "April";
        break;
    case 5:
        monthStr = "May";
        break;
    case 6:
        monthStr = "June";
        break;
    case 7:
        monthStr = "July";
        break;
    case 8:
        monthStr = "August";
        break;
    case 9:
        monthStr = "September";
        break;
    case 10:
        monthStr = "October";
        break;
    case 11:
        monthStr = "November";
        break;
    case 12:
        monthStr = "December";
        break;
  }

  return monthStr;
}

// convert date to GMT+7
function convertDateToGMT7(rawD) {
  return new Date(rawD.getTime() + rawD.getTimezoneOffset()*60*1000 + 7*60*60*1000);
}







function loadIndex() {
  var fDate = new Date;
  var fDateMY = getFormattedDateYM(fDate);
  var fDateMYD = getFormattedDateYMD(fDate);
  var upd_date = getFormattedDateYMDHMS(fDate);

  // load this month budget
  if (mydb) {
    mydb.transaction(function (t) {
      t.executeSql("SELECT * FROM budget WHERE month_year='"+fDateMY+"' ", [], function (transaction, results) {
        if (results.rows.length>0) {
          document.getElementById('this_month_budget').value = results.rows.item(0).budget;

          // load today budget
          var thisMonthBudget = Number(results.rows.item(0).budget.split(',').join(''));
          mydb.transaction(function (t) {
            t.executeSql("SELECT SUM(CAST(REPLACE(spent,',','') AS INT)) AS this_month_spending FROM spending WHERE SUBSTR(spending_date,1,7)='"+fDateMY+"' ", [], function (transaction, results) {
              var thisMonthSpendingTotal = results.rows.item(0).this_month_spending;
              thisMonthSpendingTotal = thisMonthSpendingTotal == null? 0 : thisMonthSpendingTotal;
              var thisMonthBudgetRemaining = thisMonthBudget - thisMonthSpendingTotal;
              
              var todayBudget = 0;
              var todayRemaining = 0;
              if (thisMonthBudgetRemaining > 0) {
                var fLastDateOfMonth = new Date;
                fLastDateOfMonth.setMonth(fLastDateOfMonth.getMonth()+1);
                fLastDateOfMonth.setDate(1);
                fLastDateOfMonth.setTime(fLastDateOfMonth.getTime()-24*60*60*1000);
                var remainingDay = fLastDateOfMonth.getDate() - fDate.getDate() + 1;

                var todayBudget = parseInt(thisMonthBudgetRemaining / remainingDay);
                t.executeSql("SELECT SUM(CAST(REPLACE(spent,',','') AS INT)) AS today_spending FROM spending WHERE spending_date='"+fDateMYD+"' ", [], function (transaction, results) {
                  var todaySpendingTotal = results.rows.item(0).today_spending;
                  todaySpendingTotal = todaySpendingTotal == null? 0 : todaySpendingTotal;
                  todayRemaining = todayBudget - todaySpendingTotal;

                  document.getElementById('thisMonthBudgetRemaining').innerHTML = numberWithCommas(thisMonthBudgetRemaining.toString());

                  if (todayBudget<0) {
                    document.getElementById('todayBudget').innerHTML = '0';
                  } else {
                    document.getElementById('todayBudget').innerHTML = numberWithCommas(todayBudget.toString());
                  }
                  
                  if (todayRemaining<0) {
                    document.getElementById('todayRemaining').innerHTML = '0';
                  } else {
                    document.getElementById('todayRemaining').innerHTML = numberWithCommas(todayRemaining.toString());
                  }
                });
              } else {
                document.getElementById('thisMonthBudgetRemaining').innerHTML = '0';
                document.getElementById('todayBudget').innerHTML = '0';
                document.getElementById('todayRemaining').innerHTML = '0';
              }
            });
          });

        } else {
          document.getElementById('this_month_budget').value = '0';
          mydb.transaction(function (t) {
            t.executeSql("INSERT INTO budget VALUES (?, ?, ?, ?)", [fDateMY, '0', 0, upd_date]);              
          });
        }
      });
    });
  } else {
    document.getElementById('this_month_budget').value = '0';
  }

  // load today spendings
  if (mydb) {
      mydb.transaction(function (t) {
          t.executeSql("SELECT * FROM spending WHERE spending_date='"+fDateMYD+"' ", [], 
            function (transaction, results) {
              if (results.rows.length < 1) {
                document.getElementById('todaySpendingTotal').innerHTML = '0';
                var todaySpendingListContainer = document.getElementById('todaySpendingListContainer');
                todaySpendingListContainer.innerHTML = '';
              } else {
                var todaySpendingListContainer = document.getElementById('todaySpendingListContainer');
                var i;
                var theInnerHtml = '';
                var itemsDateArray = [];
                var prevSpendingDate = '';
                var spendingTotalPerDay = 0;
                for (i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);

                    if (typeof itemsDateArray[row.spending_date] === 'undefined') {
                        itemsDateArray[row.spending_date] = [];
                    }

                    if (prevSpendingDate!=row.spending_date && prevSpendingDate!=='') {
                      theInnerHtml += 
                        // '<div style="margin-top:0;" class="content-block-title" id="spendingHistoryTitle_'+prevSpendingDate+'">'+numberWithCommas(spendingTotalPerDay.toString())+'</div>\n' + 
                        '<div class="list-block virtual-list media-list" id="todaySpendingHistoryList_'+prevSpendingDate+'"></div>\n';
                      document.getElementById('todaySpendingTotal').innerHTML = numberWithCommas(spendingTotalPerDay.toString());

                      spendingTotalPerDay = 0;
                    }
                    spendingTotalPerDay += Number(row.spent.split(',').join(''));

                    var jsonData = {};
                    jsonData['id'] = row.id;
                    jsonData['name'] = row.name;
                    jsonData['location'] = row.location;
                    jsonData['descr'] = row.descr;
                    jsonData['spent'] = row.spent;
                    itemsDateArray[row.spending_date].push(jsonData);

                    prevSpendingDate = row.spending_date;
                }
                theInnerHtml += 
                  // '<div style="margin-top:0;" class="content-block-title" id="spendingHistoryTitle_'+prevSpendingDate+'">'+numberWithCommas(spendingTotalPerDay.toString())+'</div>\n' + 
                  '<div class="list-block virtual-list media-list no-top-margin" id="todaySpendingHistoryList_'+prevSpendingDate+'"></div>\n';
                document.getElementById('todaySpendingTotal').innerHTML = numberWithCommas(spendingTotalPerDay.toString());

                todaySpendingListContainer.innerHTML = theInnerHtml;

                for (var k in itemsDateArray){
                    myApp.virtualList('#todaySpendingHistoryList_'+k, {
                        // Array with plain HTML items
                        items: itemsDateArray[k],
                        // Template 7 template to render each item
                        template: 
                        '<li>\n' + 
                        '  <a href="#" class="item-link item-content spending-edit" data-id="{{id}}">\n' + 
                        '    <div class="item-inner" style="height:77px;">\n' + 
                        '      <div class="item-title-row">\n' + 
                        '        <div class="item-title">{{name}}</div>\n' + 
                        '        <div class="item-after">{{spent}}</div>\n' + 
                        '      </div>\n' + 
                        '      <div class="item-subtitle">{{location}}</div>\n' + 
                        '      <div class="item-text">{{descr}}</div>\n' + 
                        '    </div>\n' + 
                        '  </a>\n' + 
                        '</li>',
                        height:77
                    });
                }

                $$('.spending-edit').on('click', function () {
                  loadSpendingEdit($$(this).data('id'));
                });
              }
            }
          );
      });
  } else {
      listSpendingGenerate2();
  }
}
// this month budget on focus out
  $('#this_month_budget').focusout(function() {
    if (mydb) {
      var fDate = new Date;
      var fDateMY = getFormattedDateYM(fDate);
      var upd_date = getFormattedDateYMDHMS(fDate);
      mydb.transaction(function (t) {
        t.executeSql("UPDATE budget SET budget=?, upd_date=? WHERE month_year=?", [document.getElementById('this_month_budget').value, upd_date, fDateMY]); 
      });
    } else {
      myApp.alert("Not supported on your phone.");
    }
    loadIndex();
  });
loadIndex();

myApp.onPageInit('index', function (page) {
  // this month budget on focus out
  $('#this_month_budget').focusout(function() {
    if (mydb) {
      var fDate = new Date;
      var fDateMY = getFormattedDateYM(fDate);
      var upd_date = getFormattedDateYMDHMS(fDate);
      mydb.transaction(function (t) {
        t.executeSql("UPDATE budget SET budget=?, upd_date=? WHERE month_year=?", [document.getElementById('this_month_budget').value, upd_date, fDateMY]); 
      });
    } else {
      myApp.alert("Not supported on your phone.");
    }
    loadIndex();
  });

  loadIndex();
});

myApp.onPageInit('todaySpendingAdd', function (page) {
    var spending_dateCal = myApp.calendar({
        input: '#spending_date',
        closeOnSelect: true,
    });
    document.getElementById('spending_date').value = getFormattedDateYMD(new Date);

    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            setAutoComplete(t,'name','#name');
            setAutoComplete(t,'brand','#brand');
            setAutoComplete(t,'location','#location');
        });
    } 
});

myApp.onPageInit('spending', function (page) {
  listSpending();
});

myApp.onPageInit('spendingAdd', function (page) {
    var spending_dateCal = myApp.calendar({
        input: '#spending_date',
        closeOnSelect: true,
    });

    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            setAutoComplete(t,'name','#name');
            setAutoComplete(t,'brand','#brand');
            setAutoComplete(t,'location','#location');
        });
    } 
});

myApp.onPageInit('spendingFilter', function (page) {
    mydb.transaction(function (t) {
      setAutoComplete(t,'name','#fs_name');
      setAutoComplete(t,'brand','#fs_brand');
      setAutoComplete(t,'location','#fs_location');
    });

    fs_from_spending_dateCal = myApp.calendar({
        input: '#fs_from_spending_date',
        closeOnSelect: true
        // onClose: function (p, values, displayValues) {
        //             localStorage.fs_from_spending_date = document.getElementById('fs_from_spending_date').value;
        //           }
    });
    if (!isEmpty(localStorage.fs_from_spending_date)) {
      document.getElementById('fs_from_spending_date').value = localStorage.fs_from_spending_date;
    }

    fs_to_spending_dateCal = myApp.calendar({
        input: '#fs_to_spending_date',
        closeOnSelect: true
        // onClose: function (p, values, displayValues) {
        //             localStorage.fs_to_spending_date = document.getElementById('fs_to_spending_date').value;
        //           }
    });
    if (!isEmpty(localStorage.fs_to_spending_date)) {
      document.getElementById('fs_to_spending_date').value = localStorage.fs_to_spending_date;
    }

    // $('#fs_name').focusout(function() {
    //   localStorage.fs_name = document.getElementById('fs_name').value;
    // });
    if (!isEmpty(localStorage.fs_name)) {
      document.getElementById('fs_name').value = localStorage.fs_name;
    }

    // $('#fs_brand').focusout(function() {
    //   localStorage.fs_brand = document.getElementById('fs_brand').value;
    // });
    if (!isEmpty(localStorage.fs_brand)) {
      document.getElementById('fs_brand').value = localStorage.fs_brand;
    }

    // $('#fs_location').focusout(function() {
    //   localStorage.fs_location = document.getElementById('fs_location').value;
    // });
    if (!isEmpty(localStorage.fs_location)) {
      document.getElementById('fs_location').value = localStorage.fs_location;
    }
});

myApp.onPageInit('budget', function (page) {
  listBudget();
});

myApp.onPageInit('budgetFilter', function (page) {
    if (!isEmpty(localStorage.fb_from_budget_year)) {
      document.getElementById('fb_from_budget_year').value = localStorage.fb_from_budget_year;
    }
    if (!isEmpty(localStorage.fb_to_budget_year)) {
      document.getElementById('fb_to_budget_year').value = localStorage.fb_to_budget_year;
    }
});







// Add SPENDING
function spendingAdd() {
  //check to ensure the mydb object has been created
  if (mydb) {
      //get the values of the make and model text inputs
      var name = document.getElementById("name").value;
      var brand = document.getElementById("brand").value;
      var location = document.getElementById("location").value;
      var descr = document.getElementById("descr").value;
      var spent = document.getElementById("spent").value;
      var spending_date = document.getElementById("spending_date").value;
      var is_del = 0;
      var upd_date = getFormattedDateYMDHMS(convertDateToGMT7(new Date()));

      //Test to ensure that the user has entered both a make and model
      if (name!=="" && spent!=="" && spending_date!=="") {
          //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO spending (name, brand, location, descr, spent, spending_date, is_del, upd_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [name, brand, location, descr, spent, spending_date, is_del, upd_date]);              
              listSpending();
              mainView.router.back();
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO location (name) VALUES (?)", [location]);
          });
          loadIndex();
      } else {
          myApp.alert("Input not complete!");
      }
  } else {
      myApp.alert("Not supported on your phone.");
      mainView.router.back();
  }
}

// Edit SPENDING
function spendingEdit(id) {
  //check to ensure the mydb object has been created
  if (mydb) {
      //get the values of the make and model text inputs
      var name = document.getElementById("name").value;
      var brand = document.getElementById("brand").value;
      var location = document.getElementById("location").value;
      var descr = document.getElementById("descr").value;
      var spent = document.getElementById("spent").value;
      var spending_date = document.getElementById("spending_date").value;
      var is_del = 0;
      var upd_date = getFormattedDateYMDHMS(convertDateToGMT7(new Date()));

      //Test to ensure that the user has entered both a make and model
      if (name!=="" && spent!=="" && spending_date!=="") {
          //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
          mydb.transaction(function (t) {
              t.executeSql("UPDATE spending SET name=?, brand=?, location=?, descr=?, spent=?, spending_date=?, is_del=?, upd_date=? WHERE id=?", [name, brand, location, descr, spent, spending_date, is_del, upd_date, id]);              
              listSpending();
              mainView.router.back();
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO location (name) VALUES (?)", [location]);
          });
          loadIndex();
      } else {
          myApp.alert("Input not complete!");
      }
  } else {
      myApp.alert("Not supported on your phone.");
      mainView.router.back();
  }
}

// Delete SPENDING
function spendingDel(id) {
  //check to ensure the mydb object has been created
  if (mydb) {
    mydb.transaction(function (t) {
      t.executeSql("DELETE FROM spending WHERE id=?", [id]);
      listSpending();
      loadIndex();
      mainView.router.back();
    });
  } else {
      myApp.alert("Not supported on your phone.");
      mainView.router.back();
  }
}

// list SPENDING
function listSpending() {
  //check to ensure the mydb object has been created
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          var sqlStr = "SELECT * FROM spending WHERE 1 ";
          if (!isEmpty(localStorage.fs_from_spending_date)) {
            sqlStr += "AND spending_date >= '"+localStorage.fs_from_spending_date+"' ";
          } else
          if (!isEmpty(localStorage.fs_to_spending_date)) {
            sqlStr += "AND spending_date <= '"+localStorage.fs_to_spending_date+"' ";
          }
          if (!isEmpty(localStorage.fs_name)) {
            sqlStr += "AND name = '"+localStorage.fs_name+"' ";
          }
          if (!isEmpty(localStorage.fs_brand)) {
            sqlStr += "AND brand = '"+localStorage.fs_brand+"' ";
          }
          if (!isEmpty(localStorage.fs_location)) {
            sqlStr += "AND location = '"+localStorage.fs_location+"' ";
          }
          sqlStr += 'ORDER BY spending_date ASC';
          t.executeSql(sqlStr, [], listSpendingGenerate);
      });
  } else {
      listSpendingGenerate2();
  }
}

// generate list view for SPENDING
function listSpendingGenerate(transaction, results) {
  if (results.rows.length < 1) {
    document.getElementById('spendingWelcome').innerHTML = '<p>No data. Please edit filter or add spending.</p>';
    var spendingListContainer = document.getElementById('spendingListContainer');
    spendingListContainer.innerHTML = '';
  } else {
    document.getElementById('spendingWelcome').innerHTML = '';

    var spendingListContainer = document.getElementById('spendingListContainer');
    var i;
    var theInnerHtml = '';
    var itemsDateArray = [];
    var prevSpendingDate = '';
    var spendingTotalPerDay = 0;
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);

        if (typeof itemsDateArray[row.spending_date] === 'undefined') {
            itemsDateArray[row.spending_date] = [];
        }

        if (prevSpendingDate!=row.spending_date && prevSpendingDate!=='') {
          theInnerHtml += 
            '<div class="content-block-title" id="spendingHistoryTitle_'+prevSpendingDate+'">'+getFormattedDate(prevSpendingDate)+'<br />'+numberWithCommas(spendingTotalPerDay.toString())+'</div>\n' + 
            '<div class="list-block virtual-list media-list" id="spendingHistoryList_'+prevSpendingDate+'"></div>\n';

          spendingTotalPerDay = 0;
        }
        spendingTotalPerDay += Number(row.spent.split(',').join(''));

        var jsonData = {};
        jsonData['id'] = row.id;
        jsonData['name'] = row.name;
        jsonData['location'] = row.location;
        jsonData['descr'] = row.descr;
        jsonData['spent'] = row.spent;
        itemsDateArray[row.spending_date].push(jsonData);

        prevSpendingDate = row.spending_date;
    }
    theInnerHtml += 
      '<div class="content-block-title" id="spendingHistoryTitle_'+prevSpendingDate+'">'+getFormattedDate(prevSpendingDate)+'<br />'+numberWithCommas(spendingTotalPerDay.toString())+'</div>\n' + 
      '<div class="list-block virtual-list media-list" id="spendingHistoryList_'+prevSpendingDate+'"></div>\n';

    spendingListContainer.innerHTML = theInnerHtml;

    for (var k in itemsDateArray){
        myApp.virtualList('#spendingHistoryList_'+k, {
            // Array with plain HTML items
            items: itemsDateArray[k],
            // Template 7 template to render each item
            template: 
            '<li>\n' + 
            '  <a href="#" class="item-link item-content spending-edit" data-id="{{id}}">\n' + 
            '    <div class="item-inner" style="height:77px;">\n' + 
            '      <div class="item-title-row">\n' + 
            '        <div class="item-title">{{name}}</div>\n' + 
            '        <div class="item-after">{{spent}}</div>\n' + 
            '      </div>\n' + 
            '      <div class="item-subtitle">{{location}}</div>\n' + 
            '      <div class="item-text">{{descr}}</div>\n' + 
            '    </div>\n' + 
            '  </a>\n' + 
            '</li>',
            height:77
        });
    }

    $$('.spending-edit').on('click', function () {
      loadSpendingEdit($$(this).data('id'));
    });
  }
}

// DUMMY generate list view for SPENDING
function listSpendingGenerate2() {
  var results = [
    {
      id: '1',
      name: 'name A',
      location: 'location A',
      descr: '',
      spent: '20,000',
      spending_date: '2016-01-11'
    },
    {
      id: '2',
      name: 'name A',
      location: '',
      descr: '',
      spent: '20,000',
      spending_date: '2016-01-11'
    },
    {
      id: '3',
      name: 'name A',
      location: 'location A',
      descr: 'adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf ',
      spent: '20,000',
      spending_date: '2016-01-11'
    },
    {
      id: '4',
      name: 'name A',
      location: 'location A',
      descr: 'adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf adfadsf asdfasfdasf asdfasf ',
      spent: '20,000',
      spending_date: '2016-01-12'
    },
  ];

  if (results.length < 1) {
    document.getElementById('spendingWelcome').innerHTML = '<p>No data. Please edit filter or add spending.</p>';
    var spendingListContainer = document.getElementById('spendingListContainer');
    spendingListContainer.innerHTML = '';
  } else {
    document.getElementById('spendingWelcome').innerHTML = '';

    var spendingListContainer = document.getElementById('spendingListContainer');
    var i;
    var theInnerHtml = '';
    var itemsDateArray = [];
    var prevSpendingDate = '';
    var spendingTotalPerDay = 0;
    for (i = 0; i < results.length; i++) {
        var row = results[i];

        if (typeof itemsDateArray[row.spending_date] === 'undefined') {
            itemsDateArray[row.spending_date] = [];
        }

        if (prevSpendingDate!=row.spending_date && prevSpendingDate!=='') {
          theInnerHtml += 
            '<div class="content-block-title" id="spendingHistoryTitle_'+prevSpendingDate+'">'+getFormattedDate(prevSpendingDate)+'<br />'+numberWithCommas(spendingTotalPerDay.toString())+'</div>\n' + 
            '<div class="list-block virtual-list media-list" id="spendingHistoryList_'+prevSpendingDate+'"></div>\n';

          spendingTotalPerDay = 0;
        }
        spendingTotalPerDay += Number(row.spent.split(',').join(''));

        var jsonData = {};
        jsonData['id'] = row.id;
        jsonData['name'] = row.name;
        jsonData['location'] = row.location;
        jsonData['descr'] = row.descr;
        jsonData['spent'] = row.spent;
        itemsDateArray[row.spending_date].push(jsonData);

        prevSpendingDate = row.spending_date;
    }
    theInnerHtml += 
      '<div class="content-block-title" id="spendingHistoryTitle_'+prevSpendingDate+'">'+getFormattedDate(prevSpendingDate)+'<br />'+numberWithCommas(spendingTotalPerDay.toString())+'</div>\n' + 
      '<div class="list-block virtual-list media-list" id="spendingHistoryList_'+prevSpendingDate+'"></div>\n';

    spendingListContainer.innerHTML = theInnerHtml;

    for (var k in itemsDateArray){
        myApp.virtualList('#spendingHistoryList_'+k, {
            // Array with plain HTML items
            items: itemsDateArray[k],
            // Template 7 template to render each item
            template: 
            '<li>\n' + 
            '  <a href="#" class="item-link item-content spending-edit" data-id="{{id}}">\n' + 
            '    <div class="item-inner" style="height:77px;">\n' + 
            '      <div class="item-title-row">\n' + 
            '        <div class="item-title">{{name}}</div>\n' + 
            '        <div class="item-after">{{spent}}</div>\n' + 
            '      </div>\n' + 
            '      <div class="item-subtitle">{{location}}</div>\n' + 
            '      <div class="item-text">{{descr}}</div>\n' + 
            '    </div>\n' + 
            '  </a>\n' + 
            '</li>',
            height:77
        });
    }

    $$('.spending-edit').on('click', function () {
      loadSpendingEdit($$(this).data('id'));
    });
  }
}

// load spending data to edit
function loadSpendingEdit(id) {
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          t.executeSql("SELECT * FROM spending WHERE id=?", [id], function (transaction, results) {
            if (results.rows.length>=1) {
              loadSpendingEditPage(results.rows.item(0));
            }
          });
          // t.executeSql("SELECT * FROM name", [], showNames);
      });
  } else {
      var data = {};
      data['id']=1;
      data['spending_date']='2015-12-12';
      data['name']='Sepatu';
      loadSpendingEditPage(data);
  }
}

// load Edit Spending page
function loadSpendingEditPage (data) {
  mainView.router.loadContent(
    '<!-- Top Navbar-->\n' + 
    '<div class="navbar">\n' + 
    '  <div class="navbar-inner">\n' + 
    '    <div class="left"><a href="#" class="back link"> <i class="icon icon-back"></i><span>Back</span></a></div>\n' + 
    '    <div class="center sliding">Edit Spending</div>\n' + 
    '    <div class="right">\n' + 
    '      <a href="#" class="link icon-only open-panel"> <i class="icon icon-bars"></i></a>\n' + 
    '    </div>\n' + 
    '  </div>\n' + 
    '</div>\n' + 
    '<div class="pages">\n' + 
    '  <!-- Page, data-page contains page name-->\n' + 
    '  <div data-page="spendingAdd" class="page">\n' + 
    '    <!-- Scrollable page content-->\n' + 
    '    <div class="page-content">\n' + 
    '      <div class="content-block">\n' + 
    '        <div class="list-block">\n' + 
    '          <ul>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Spending date" readonly id="spending_date" value="'+data.spending_date+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Name" id="name" value="'+data.name+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Brand" id="brand" value="'+data.brand+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Where do you buy?" id="location" value="'+data.location+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="text" placeholder="Description" id="descr" value="'+data.descr+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="tel" placeholder="How much?" onkeypress="return isNumberKey(event);" onkeyup="this.value=numberWithCommas(this.value);" id="spent" value="'+data.spent+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '          </ul>\n' + 
    '        </div>\n' + 
    '        <div class="row">\n' + 
    '          <div class="col-50">\n' + 
    '            <a href="#" class="button button-big button-fill color-gray" style="background-color:red;" onclick="spendingDel('+data.id+');">Delete</a>\n' + 
    '          </div>\n' + 
    '          <div class="col-50">\n' + 
    '            <a href="#" class="button button-big button-fill color-gray" style="background-color:grey;" onclick="spendingEdit('+data.id+');">Edit</a>\n' + 
    '          </div>\n' + 
    '        </div>\n' + 
    '      </div>\n' + 
    '    </div>\n' + 
    '  </div>\n' + 
    '</div>\n'
  );
  return;
}

// clear spending filter
function spendingFilterClear() {
  fs_from_spending_dateCal.setValue('');
  fs_to_spending_dateCal.setValue('');
  document.getElementById('fs_name').value = '';
  document.getElementById('fs_brand').value = '';
  document.getElementById('fs_location').value = '';

  // localStorage.fs_from_spending_date = '';
  // localStorage.fs_to_spending_date = '';
  // localStorage.fs_name = '';
  // localStorage.fs_brand = '';
  // localStorage.fs_location = '';
}

// apply spending filter
function spendingFilterApply() {
  localStorage.fs_from_spending_date = document.getElementById('fs_from_spending_date').value;
  localStorage.fs_to_spending_date = document.getElementById('fs_to_spending_date').value;
  localStorage.fs_name = document.getElementById('fs_name').value;
  localStorage.fs_brand = document.getElementById('fs_brand').value;
  localStorage.fs_location = document.getElementById('fs_location').value;
}



// Add BUDGET
function budgetAdd() {
  if (mydb) {
      //get the values of the make and model text inputs
      var budget_month = document.getElementById('budget_month').value.trim();
      var budget_year = document.getElementById("budget_year").value.trim();
      var budget = document.getElementById("budget").value.trim();
      var budgetNumber = Number(budget.split(',').join(''));
      var is_del = 0;
      var upd_date = getFormattedDateYMDHMS(convertDateToGMT7(new Date()));

      //Test to ensure that the user has entered both a make and model
      if (budget_month!=="" && budget_year!=="" && budget!=="" && budgetNumber!=0) {
        mydb.transaction(function (t) {  
          t.executeSql("SELECT COUNT(1) AS budget_count FROM budget WHERE month_year='"+budget_year+"-"+budget_month+"' ", [], 
            function (transaction, results) {
              if (results.rows.length>0 && Number(results.rows.item(0).budget_count)>0) {
                myApp.prompt("Budget exists for "+getMonthString(budget_month)+" "+budget_year+".\n"+
                  "Please re-input month and year in MM-YYYY.\n"+
                  "E.g.: 01-2016", 
                  'Data Exists', 
                  function (value) {
                    if (value===budget_month+'-'+budget_year) {
                      mydb.transaction(function (t) {
                          t.executeSql("UPDATE budget set budget=?, upd_date=? WHERE month_year=?", [budget,upd_date,budget_year+'-'+budget_month]);
                          myApp.alert('Budget for '+getMonthString(budget_month)+" "+budget_year+'\n'+
                            'is now '+budget); 
                          listBudget();
                          mainView.router.back();
                      });
                    } else {
                      myApp.alert("Month and year don't match!"); 
                    }
                  }
                );
              } else {
                mydb.transaction(function (t) {
                  t.executeSql("INSERT INTO budget VALUES(?,?,?,?)", [budget_year+'-'+budget_month,budget,is_del,upd_date]);
                  listBudget();
                  mainView.router.back();
                });
              }
            }
          );
        });
        mydb.transaction(function (t) {
            t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
        });
        mydb.transaction(function (t) {
            t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
        });
        mydb.transaction(function (t) {
            t.executeSql("INSERT INTO location (name) VALUES (?)", [location]);
        });

        loadIndex();
      } else {
          myApp.alert("Invalid input or incomplete!");
      }
  } else {
      myApp.alert("Not supported on your phone.");
      mainView.router.back();
  }
}

// Edit BUDGET
function budgetEdit(month_year) {
  //check to ensure the mydb object has been created
  if (mydb) {
      //get the values of the make and model text inputs
      var budget = document.getElementById("budget").value.trim();
      var budgetNumber = Number(budget.split(',').join(''));
      var is_del = 0;
      var upd_date = getFormattedDateYMDHMS(convertDateToGMT7(new Date()));

      //Test to ensure that the user has entered both a make and model
      if (budget!=="" && budgetNumber!=0) {
          //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
          mydb.transaction(function (t) {
              t.executeSql("UPDATE budget SET budget=?, upd_date=? WHERE month_year=?", [budget, upd_date, month_year]);              
              listBudget();
              mainView.router.back();
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO name (name) VALUES (?)", [name]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO brand (name) VALUES (?)", [brand]);
          });
          mydb.transaction(function (t) {
              t.executeSql("INSERT INTO location (name) VALUES (?)", [location]);
          });

          loadIndex();
      } else {
          myApp.alert("Input not complete!");
      }
  } else {
      myApp.alert("Not supported on your phone.");
      mainView.router.back();
  }
}

// Delete BUDGET
function budgetDel(month_year) {
  //check to ensure the mydb object has been created
  if (mydb) {
    mydb.transaction(function (t) {
      t.executeSql("DELETE FROM budget WHERE month_year=?", [month_year]);
      listBudget();
      loadIndex();
      mainView.router.back();
    });
  } else {
      myApp.alert("Not supported on your phone.");
      mainView.router.back();
  }
}

// list BUDGET
function listBudget() {
  //check to ensure the mydb object has been created
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          var sqlStr = "SELECT * FROM budget WHERE 1 ";
          if (!isEmpty(localStorage.fb_from_budget_year)) {
            sqlStr += "AND month_year >= '"+localStorage.fb_from_budget_year+"-01' ";
          } else
          if (!isEmpty(localStorage.fb_to_budget_year)) {
            sqlStr += "AND month_year <= '"+localStorage.fb_to_budget_year+"-12' ";
          }
          sqlStr += 'ORDER BY month_year ASC';
          t.executeSql(sqlStr, [], listBudgetGenerate);
      });
  } else {
      listBudgetGenerate2();
  }
}

// generate list view for BUDGET
function listBudgetGenerate(transaction, results) {
  if (results.rows.length < 1) {
    document.getElementById('budgetWelcome').innerHTML = '<p>No data. Please edit filter or add budget.</p>';
    var budgetListContainer = document.getElementById('budgetListContainer');
    budgetListContainer.innerHTML = '';
  } else {
    document.getElementById('budgetWelcome').innerHTML = '';

    var budgetListContainer = document.getElementById('budgetListContainer');
    var i;
    var theInnerHtml = '';
    var itemsDateArray = [];
    var prevYear = '';
    // var budgetTotalPerYear = 0;
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        var budget_year = row.month_year.substring(0,4);

        if (typeof itemsDateArray[budget_year] === 'undefined') {
            itemsDateArray[budget_year] = [];
        }

        if (prevYear!=budget_year && prevYear!=='') {
          theInnerHtml += 
            '<div class="content-block-title" id="budgetHistoryTitle_'+prevYear+'">'+prevYear+'</div>\n' + 
            '<div class="list-block virtual-list" id="budgetHistoryList_'+prevYear+'"></div>\n';

          // budgetTotalPerYear = 0;
        }
        // budgetTotalPerYear += Number(row.spent.split(',').join(''));

        var jsonData = {};
        jsonData['month_year'] = row.month_year;
        jsonData['month_str'] = getMonthString(row.month_year.substring(5,7));
        jsonData['budget'] = row.budget;
        itemsDateArray[budget_year].push(jsonData);

        prevYear = budget_year;
    }
    theInnerHtml += 
      '<div class="content-block-title" id="budgetHistoryTitle_'+prevYear+'">'+prevYear+'</div>\n' + 
      '<div class="list-block virtual-list" id="budgetHistoryList_'+prevYear+'"></div>\n';

    budgetListContainer.innerHTML = theInnerHtml;

    for (var k in itemsDateArray){
        myApp.virtualList('#budgetHistoryList_'+k, {
            // Array with plain HTML items
            items: itemsDateArray[k],
            // Template 7 template to render each item
            template: 
            '<li class="item-content budget-edit" data-id="{{month_year}}">\n' + 
            '  <div class="item-inner">\n' + 
            '    <div class="item-title">{{month_str}}</div>\n' + 
            '    <div class="item-after">{{budget}}</div>\n' + 
            '  </div>\n' + 
            '</li>'
        });
    }

    $$('.budget-edit').on('click', function () {
      loadBudgetEdit($$(this).data('id'));
    });
  }
}

// load budget data to edit
function loadBudgetEdit(month_year) {
  if (mydb) {
      //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
      mydb.transaction(function (t) {
          t.executeSql("SELECT * FROM budget WHERE month_year=?", [month_year], function (transaction, results) {
            if (results.rows.length>=1) {
              loadBudgetEditPage(results.rows.item(0));
            }
          });
      });
  } else {
      var data = {};
      data['id']=1;
      data['month_year']='2015-12-12';
      data['budget']='7,777,700';
      loadBudgetEditPage(data);
  }
}

// load Edit Budget page
function loadBudgetEditPage (data) {    
  mainView.router.loadContent(
    '<!-- We don\'t need full layout here, because this page will be parsed with Ajax-->\n' + 
    '<!-- Top Navbar-->\n' + 
    '<div class="navbar">\n' + 
    '  <div class="navbar-inner">\n' + 
    '    <div class="left"><a href="#" class="back link"> <i class="icon icon-back"></i><span>Back</span></a></div>\n' + 
    '    <div class="center sliding">Edit Budget</div>\n' + 
    '    <div class="right">\n' + 
    '      <a href="#" class="link icon-only open-panel"> <i class="icon icon-bars"></i></a>\n' + 
    '    </div>\n' + 
    '  </div>\n' + 
    '</div>\n' + 
    '<div class="pages">\n' + 
    '  <!-- Page, data-page contains page name-->\n' + 
    '  <div data-page="budgetAdd" class="page">\n' + 
    '    <!-- Scrollable page content-->\n' + 
    '    <div class="page-content">\n' + 
    '      <div class="content-block">\n' + 
    '        <div class="list-block">\n' + 
    '          <ul>\n' + 
    '            <li class="item-content">\n' + 
    '              <div class="item-inner">\n' + 
    '                <div class="item-title">'+getMonthString(data.month_year.substring(5,7))+' '+data.month_year.substring(0,4)+'</div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '            <li>\n' + 
    '              <div class="item-content">\n' + 
    '                <div class="item-inner">\n' + 
    '                  <div class="item-input">\n' + 
    '                    <input type="tel" placeholder="How much?" onkeypress="return isNumberKey(event);" onkeyup="this.value=numberWithCommas(this.value);" id="budget" value="'+data.budget+'">\n' + 
    '                  </div>\n' + 
    '                </div>\n' + 
    '              </div>\n' + 
    '            </li>\n' + 
    '          </ul>\n' + 
    '        </div>\n' + 
    '        <div class="row">\n' + 
    '          <div class="col-50">\n' + 
    '            <a href="#" class="button button-big button-fill color-gray" style="background-color:red;" onclick="budgetDel(\''+data.month_year+'\');">Delete</a>\n' + 
    '          </div>\n' + 
    '          <div class="col-50">\n' + 
    '            <a href="#" class="button button-big button-fill color-gray" style="background-color:grey;" onclick="budgetEdit(\''+data.month_year+'\');">Edit</a>\n' + 
    '          </div>\n' + 
    '        </div>\n' + 
    '      </div>\n' + 
    '    </div>\n' + 
    '  </div>\n' + 
    '</div>'
  );
  return;
}

// clear budget filter
function budgetFilterClear() {
  document.getElementById('fb_from_budget_year').value = '';
  document.getElementById('fb_to_budget_year').value = '';
}

// apply budget filter
function budgetFilterApply() {
  localStorage.fb_from_budget_year = document.getElementById('fb_from_budget_year').value;
  localStorage.fb_to_budget_year = document.getElementById('fb_to_budget_year').value;
}