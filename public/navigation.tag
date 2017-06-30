<navigation>
  <div class="containerV">
    <div class="containerH">
      <div style="flex-basis:30%">
        <div>
          <label>Saisis l'adresse mail avec laquelle tu t'es inscrit-e au Camp Climat :</label>
        </div>
        <div>
          <input type="texte" onchange={emailchange} style="width:100%">
        </div>
      </div>
      <div style="justify-content:center;flex-basis:35%;" class="containerH" if={true}>
        <div class="button containerV" onclick={mailValidation}>
          <div style="justify-content:center;" class="containerH">
            vérifier que tu es bien inscrit-e au Camp Climat
          </div>
          <div style="justify-content:center;" class="containerH">
            et commencer tes inscriptions aux activités
          </div>
        </div>
      </div>
      <div if={notConnected} class=containerH style="flex-basis:30%;">
        <div class="notConnected containerH" style="justify-content:center;">
          Aucune inscription au Camp Climat n'a été effectuée avec cette adresse mail ; tu ne peux donc pas t'inscrire aux activités, désolé !
        </div>
      </div>
      <div if={userConnected!=undefined && userConnected.overwrite} class=containerH style="flex-basis:30%;">
        <div class="containerH" style="justify-content:center;">
          Tu as déjà renseigné ce formulaire. Les informations déjà fournies ont été reprises. La validation replacera les informations existantes.
        </div>
      </div>
    </div>

    <div if={days!=undefined} class="containerH">
      <div class="containerV">
        <div>
          <label>La date d'arrivée que tu as indiquée (tu peux la mettre à jour) :</label>
        </div>
        <div>
          <input type="text" value={userConnected.dateDebutInputValue} name="dateDebut" id="dateDebut">
        </div>
      </div>
    </div>
    <div if={days!=undefined} class="containerH">
      <div class="containerV">
        <div >
          <label>La date de départ que tu as indiquée (tu peux la mettre à jour) :</label>
        </div>
        <div>
          <input type="text" value={userConnected.dateFinInputValue} name="dateFin" id="dateFin">
        </div>
      </div>
    </div>
    <div if={days!=undefined} class="containerH">
      <div class="containerV">
        <div>
          <label>S'il y a des changements dans les informations que tu nous as données dans le premier formulaire, merci de nous les indiquer ici :</label>
        </div>
        <div>
          <textarea style="width:100%" onchange={commentChange}>{userConnected.comment}</textarea>
        </div>
      </div>
    </div>
  </div>

  <div class="booking containerH" style="flex-wrap: nowrap;height:480px;" if={days!=undefined}>

    <div style="flex-basis:200px" class="containerV">
      <div each={days} class={button:true, menuDay:true, menuDaySelected:currentDay.getTime()==date.getTime()} onclick={dayClick}>
        <span>{weekDays[date.getDay()]} {date.getDate()} {months[date.getMonth()]}</span>
      </div>
    </div>

    <div each={days} style="flex-basis:100%" class="day containerV" style="overflow-y: scroll;" id={date.getTime()} if={currentDay.getTime()==date.getTime()}>

      <div class="containerH sectionHeader" style="justify-content:center">
        <div>
          {weekDays[date.getDay()]} {date.getDate()} {months[date.getMonth()]}
        </div>
      </div>
      <div class="slots">

        <div each={slots} class={booked:booked, disallow:disallow,containerV:true,slot:true}>

          <div class="containerH" style="flex-wrap: nowrap;">

            <div style="flex-basis:100px" class="containerH">
              <input type="checkbox" onchange={changeSelect} if={L==undefined && !disallow && M==undefined} checked={checked}>
              <div class="containerH" style="padding:0px;" if={L==undefined && !disallow && M!=undefined}>
                <input type="radio" name="mand-{id}" value="true" onchange={changeRadio} checked={checked==true}>
                <span>oui</span>
              </div>
              <div class="containerH" style="padding:0px;" if={L==undefined && !disallow && M!=undefined}>
                <input type="radio" name="mand-{id}" value="false" onchange={changeRadio} checked={checked==false}>
                <span>non</span>
              </div>
            </div>

            <div class="containerH" style="flex-basis:60px">
              <span>{D}</span>
            </div>
            <div class="containerH" style="flex-basis:60px">
              <span>{E}</span>
            </div>
            <div class="containerH" style="flex-basis:100%">
              <span style="font-weight: bold;">{A}</span>
            </div>
          </div>
          <div class="containerH">
            <div class="containerH moreInfo" onclick={moreInfoClick}>
              <img width="20" height="20" src="./resources/moreInfo.png">
              <span>plus d'infos</span>
            </div>
            <div class="containerH" style="flex-basis:300px">
              <span>{G}</span>
            </div>

            <div class="containerH" style="flex-basis:100px">
              <span if={!full}>
                {reservation} / {jauge}
              </span>
              <span if={full}>
                COMPLET
              </span>
            </div>
          </div>

          <div class="containerH" if={otherSlots!=undefined && otherSlots.length>0}>
            <div>
              Cette formation bloque ces autres créneaux :
            </div>
            <div each={otherSlots} class="colSpanRow">
              {weekDays[date.getDay()]} {date.getDate()} {months[date.getMonth()]} {D} à {E}
            </div>
          </div>
          <div class="containerH" if={mainSlots!=undefined && mainSlots.length>0}>
            <div>
              Pour s'inscrire à cette formation, vous devez vous inscrire le :
            </div>
            <div each={mainSlots} class="colSpanRow">
              {weekDays[date.getDay()]} {date.getDate()} {months[date.getMonth()]} {D} à {E}
            </div>
          </div>

          <div class="containerH" if={dependencies!=undefined && dependencies.length>0}>
            <div>
              Vous ne pouvez vous inscrire à cette formation qu' à condition de vous être aussi inscrit à :
            </div>
            <div each={dependencies} class="colSpanRow">
              <span>{B}</span>
            </div>
          </div>

          <div if={moreInfo==true} class="containerV">
            <div>
              <span>descrition : {formation.F}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
<div each={warningMessages} class="containerH notConnected" style="background-color:Orange">
  <div class="containerV">
    <div if={message=='domaine' }>
      Nous vous invitons à vous inscrire à au moins {data.minInscription.C} activité{data.minInscription.C>1?'s':''} du domaine {data.domaine.A}
    </div>
  </div>
</div>
<div each={blockingMessages} class="containerH notConnected" >
  <div class="containerV">
    <div if={message=='mandatory' }>
      Vous devez obligatoirement répondre concernant votre présence à l'activité {data.formation.A} qui se déroule le {data.dateDisplay}
    </div>

  </div>
</div>


<div class="containerH" style="justify-content:center" if={days!=undefined && !inscriptionDone && blockingMessages.length==0}>
  <div style="flex-basis:60%;justify-content:center" class="button containerH" onclick={persistSlots}>
    <div>
      valider
    </div>
  </div>
</div>
<div class="containerH" style="justify-content:center" if={inscriptionDone}>
  <div style="flex-basis:60%;justify-content:center" class="containerH" onclick={persistSlots}>
    <div >
      Votre inscription a bien été enregistrée avec les informations ci-dessus
    </div>
  </div>
</div>
</div>
<script>
//this.email = "simon.louvet.zen@gmail.com";
this.weekDays = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi'
];
this.months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
];

this.inscriptioDone = false;
this.notConnected = false;
this.warningMessages = [];
this.blockingMessages = [];

this.on('mount', function () {
  //RiotControl.trigger('slots_init'); this.update();
});
this.on('update', function () {
  setTimeout(function () {
    // console.log($(".datePicker")); var param = {   firstDay: 1,   altField: ".datePicker",   closeText: 'Fermer',   prevText: 'Précédent',   nextText: 'Suivant',   currentText: 'Aujourd\'hui',   monthNames: [     'Janvier',     'Février',     'Mars',
    // 'Avril',     'Mai',     'Juin',     'Juillet',     'Août',     'Septembre',     'Octobre',     'Novembre',     'Décembre'   ],   monthNamesShort: [     'Janv.',     'Févr.',     'Mars',     'Avril',     'Mai',     'Juin',     'Juil.', 'Août',
    // 'Sept.',     'Oct.',     'Nov.',     'Déc.'   ],   dayNames: [     'Dimanche',     'Lundi',     'Mardi',     'Mercredi',     'Jeudi',     'Vendredi',     'Samedi'   ],   dayNamesShort: [     'Dim.',     'Lun.',     'Mar.',     'Mer.',    'Jeu.',
    // 'Ven.',     'Sam.'   ],   dayNamesMin: [     'D',     'L',     'M',     'M',     'J',     'V',     'S'   ],   weekHeader: 'Sem.',   dateFormat: 'dd/mm/yy',   onSelect: function (str, inst) {     var objectDate = new Date(inst.selectedYear,
    // inst.selectedMonth, inst.selectedDay);     if (inst.id == "dateDebut") {       //  RiotControl.trigger('dateDebut_change', objectDate,str);     }     if (inst.id == "dateFin") {       //RiotControl.trigger('dateFin_change', objectDate,str);     }
    // }.bind(this) };
    /*
    if (this.days != undefined) {
      console.log('tabs', $(".booking"));
      $(".booking").tabs({active: 0});
    }
    */

    $("#dateDebut").datepicker({
      firstDay: 1,
      altField: ".datePicker",
      closeText: 'Fermer',
      prevText: 'Précédent',
      nextText: 'Suivant',
      currentText: 'Aujourd\'hui',
      monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
      ],
      monthNamesShort: [
        'Janv.',
        'Févr.',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juil.',
        'Août',
        'Sept.',
        'Oct.',
        'Nov.',
        'Déc.'
      ],
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
      ],
      dayNamesShort: [
        'Dim.',
        'Lun.',
        'Mar.',
        'Mer.',
        'Jeu.',
        'Ven.',
        'Sam.'
      ],
      dayNamesMin: [
        'D',
        'L',
        'M',
        'M',
        'J',
        'V',
        'S'
      ],
      weekHeader: 'Sem.',
      dateFormat: 'dd/mm/yy',
      onSelect: function (str, inst) {
        var objectDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);

        RiotControl.trigger('dateDebut_change', objectDate, str);

      }.bind(this)
    });
    $("#dateFin").datepicker({
      firstDay: 1,
      altField: ".datePicker",
      closeText: 'Fermer',
      prevText: 'Précédent',
      nextText: 'Suivant',
      currentText: 'Aujourd\'hui',
      monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
      ],
      monthNamesShort: [
        'Janv.',
        'Févr.',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juil.',
        'Août',
        'Sept.',
        'Oct.',
        'Nov.',
        'Déc.'
      ],
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
      ],
      dayNamesShort: [
        'Dim.',
        'Lun.',
        'Mar.',
        'Mer.',
        'Jeu.',
        'Ven.',
        'Sam.'
      ],
      dayNamesMin: [
        'D',
        'L',
        'M',
        'M',
        'J',
        'V',
        'S'
      ],
      weekHeader: 'Sem.',
      dateFormat: 'dd/mm/yy',
      onSelect: function (str, inst) {
        var objectDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);

        RiotControl.trigger('dateFin_change', objectDate, str);

      }.bind(this)
    });
    // .on('change', function (e) {     //console.log("Date changed: ", e.target.value);     //alert($(this).val())     console.log($(this).val()); });
  }.bind(this), 10);

})

RiotControl.on('days_changed', function (data) {
  console.log(data);
  this.days = data;
  if (this.currentDay == undefined) {
    this.currentDay = data[0].date;
  }
  this.update();
}.bind(this));

RiotControl.on('messages_changed', function (warningMessages, blockingMessages) {
  //console.log(data);
  this.warningMessages = warningMessages;
  this.blockingMessages = blockingMessages;
  this.update();
}.bind(this));

RiotControl.on('user_connected', function (data) {
  this.notConnected = false;
  this.userConnected = data;
  this.update();
}.bind(this))

RiotControl.on('user_not_connected', function (data) {
  this.notConnected = true;
  this.update();
}.bind(this))

RiotControl.on('inscription_done', function (data) {
  this.inscriptionDone = true;
  this.update();
}.bind(this))

changeSelect(e) {
  RiotControl.trigger('switch_select', e.item, e.target.checked);
}

changeRadio(e) {
  if (e.target.checked && e.target.value == 'true') {
    RiotControl.trigger('switch_select', e.item, true);
  }
  if (e.target.checked && e.target.value == 'false') {
    RiotControl.trigger('switch_select', e.item, false);
  }
}

persistSlots(e) {
  RiotControl.trigger('persist_slots');
}

emailchange(e) {
  this.email = e.target.value;
}

mailValidation(e) {
  RiotControl.trigger('email_change', this.email);
}

moreInfoClick(e) {
  //console.log('ALLO');
  RiotControl.trigger('more_info', e.item);
}

dayClick(e) {
  //console.log('ALLO'); RiotControl.trigger('more_info', e.item);
  this.currentDay = e.item.date;
}

commentChange(e){
  RiotControl.trigger('comment_change', e.target.value);
}
</script>
<style>
.slots {
  /*padding: 10px;*/
  display: table;
  width:100%;
}
.row {
  display: table-row;
}
.row > * {
  display: table-cell;
  padding: 2px;
}
.booked {
  background-color: GreenYellow;
}

.disallow {
  color: grey;
}

.sectionHeader {
  background-color: green;
  color: white;
}
.slot {
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.button {
  background-color: green;
  color: white;
  cursor: pointer;
  border-color: green;
  border-style: solid;
  border-width: 5px;
  border-radius: 5px;
}
.button:hover {
  border-color: DarkGreen;
  background-color: DarkGreen;
}

.moreInfo {
  cursor: pointer;
}
.moreInfo:hover {
  color: green;
}

.booking {
  margin-top: 20px;
  margin-bottom: 20px;
  border-style: solid;
  border-width: 1px;
  /*display: table;*/
}
.day {
  margin-top: 10px;
  /*display: table;*/
}

.slots {
  /*display: table;*/
}

.notConnected {
  background-color: DarkOrange;
  color: white;
}

.menuDay {
  margin: 2px;
  color: DarkGreen;
  background: white;
  border-width: 2px;
  padding: 5px;
}
.menuDay:hover {
  color: white;
  background: ForestGreen;
}

.menuDaySelected {
  color: white;
  background: DarkGreen;
}

</style>
</navigation>
