dump('entering patron.summary.js\n');

if (typeof patron == 'undefined') patron = {};
patron.summary = function (params) {

	JSAN.use('util.error'); this.error = new util.error();
	JSAN.use('util.window'); this.window = new util.window();
	JSAN.use('util.network'); this.network = new util.network();
	this.w = window;
}

patron.summary.prototype = {

	'init' : function( params ) {

		var obj = this;

		obj.barcode = params['barcode'];
		obj.id = params['id'];

		JSAN.use('OpenILS.data'); this.OpenILS = {}; 
		obj.OpenILS.data = new OpenILS.data(); obj.OpenILS.data.init({'via':'stash'});

		JSAN.use('util.controller'); obj.controller = new util.controller();
		obj.controller.init(
			{
				control_map : {
					'cmd_broken' : [
						['command'],
						function() { alert('Not Yet Implemented'); }
					],
					'patron_alert' : [
						['render'],
						function(e) {
							return function() {
								JSAN.use('util.widgets');
								util.widgets.remove_children( e );
								if (obj.patron.alert_message()) {
									e.appendChild(
										document.createTextNode(
											obj.patron.alert_message()
										)
									);
									e.parentNode.hidden = false;
								} else {
									e.parentNode.hidden = true;
								}
							};
						}
					],
					'patron_usrname' : [
						['render'],
						function(e) {
							return function() {
								e.setAttribute('value',obj.patron.usrname());
							};
						}
					],
					'patron_profile' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.OpenILS.data.hash.pgt[
										obj.patron.profile()
									].name()
								);
							};
						}
					],
					'patron_standing' : [
						['render'],
						function(e) {
							return function() {
								e.setAttribute('value',
									obj.OpenILS.data.hash.cst[
										obj.patron.standing()
									].value()
								);
								var e2 = document.getElementById('patron_standing_penalties');
								JSAN.use('util.widgets');
								util.widgets.remove_children(e2);
								var penalties = obj.patron.standing_penalties();
								for (var i = 0; i < penalties.length; i++) {
									var x = document.createElement('label');
									x.setAttribute('value',penalties[i].penalty_type());
									e2.appendChild(x);
								}
							};
						}
					],
					'patron_credit' : [
						['render'],
						function(e) {
							return function() { 
								JSAN.use('util.money');
								e.setAttribute('value',
									util.money.sanitize(
										obj.patron.credit_forward_balance()
									)
								);
							};
						}
					],
					'patron_bill' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value','...');
								obj.network.simple_request(
									'FM_MOBTS_TOTAL_HAVING_BALANCE',
									[ ses(), obj.patron.id() ],
									function(req) {
										JSAN.use('util.money');
										e.setAttribute('value',
											util.money.sanitize( 
												req.getResultObject() 
											)
										);
									}
								);
							};
						}
					],
					'patron_checkouts' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value','...');
								var e2 = document.getElementById(
									'patron_overdue'
								);
								if (e2) e2.setAttribute('value','...');
								obj.network.simple_request(
									'FM_CIRC_COUNT_RETRIEVE_VIA_USER',
									[ ses(), obj.patron.id() ],
									function(req) {
										e.setAttribute('value',
											req.getResultObject().total	
										);
										if (e2) e2.setAttribute('value',
											req.getResultObject().overdue	
										);
									}
								);
							};
						}
					],
					'patron_overdue' : [
						['render'],
						function(e) {
							return function() { 
								/* handled by 'patron_checkouts' */
							};
						}
					],
					'patron_holds' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value','...');
								var e2 = document.getElementById('patron_holds_available');
								if (e2) e2.setAttribute('value','...');
								obj.network.simple_request(
									'FM_AHR_COUNT_RETRIEVE',
									[ ses(), obj.patron.id() ],
									function(req) {
										e.setAttribute('value',
											req.getResultObject().total
										);
										if (e2) e2.setAttribute('value',
											req.getResultObject().ready
										);
									}
								);
							};
						}
					],
					'patron_holds_available' : [
						['render'],
						function(e) {
							return function() { 
								/* handled by 'patron_holds' */
							};
						}
					],
					'patron_card' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.card().barcode()
								);
							};
						}
					],
					'patron_ident_type_1' : [
						['render'],
						function(e) {
							return function() { 
								var ident_string = '';
								var ident = obj.OpenILS.data.hash.cit[
									obj.patron.ident_type()
								];
								if (ident) ident_string = ident.name()
								e.setAttribute('value',
									ident_string
								);
							};
						}
					],
					'patron_ident_value_1' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.ident_value()
								);
							};
						}
					],
					'patron_ident_type_2' : [
						['render'],
						function(e) {
							return function() { 
								var ident_string = '';
								var ident = obj.OpenILS.data.hash.cit[
									obj.patron.ident_type2()
								];
								if (ident) ident_string = ident.name()
								e.setAttribute('value',
									ident_string
								);
							};
						}
					],
					'patron_ident_value_2' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.ident_value2()
								);
							};
						}
					],
					'patron_date_of_birth' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.dob()
								);
							};
						}
					],
					'patron_day_phone' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.day_phone()
								);
							};
						}
					],
					'patron_evening_phone' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.evening_phone()
								);
							};
						}
					],
					'patron_other_phone' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.other_phone()
								);
							};
						}
					],
					'patron_email' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.email()
								);
							};
						}
					],
					'patron_photo_url' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('src',
									obj.patron.photo_url()
								);
							};
						}
					],
					'patron_library' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.OpenILS.data.hash.aou[
										obj.patron.home_ou()
									].shortname()
								);
								e.setAttribute('tooltiptext',
									obj.OpenILS.data.hash.aou[
										obj.patron.home_ou()
									].name()
								);
							};
						}
					],
					'patron_last_library' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.OpenILS.data.hash.aou[
										obj.patron.home_ou()
									].shortname()
								);
								e.setAttribute('tooltiptext',
									obj.OpenILS.data.hash.aou[
										obj.patron.home_ou()
									].name()
								);
							};
						}
					],
					'patron_mailing_address_street1' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.mailing_address().street1()
								);
							};
						}
					],
					'patron_mailing_address_street2' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.mailing_address().street2()
								);
							};
						}
					],
					'patron_mailing_address_city' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.mailing_address().city()
								);
							};
						}
					],
					'patron_mailing_address_state' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.mailing_address().state()
								);
							};
						}
					],
					'patron_mailing_address_post_code' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.mailing_address().post_code()
								);
							};
						}
					],
					'patron_physical_address_street1' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.billing_address().street1()
								);
							};
						}
					],
					'patron_physical_address_street2' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.billing_address().street2()
								);
							};
						}
					],
					'patron_physical_address_city' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.billing_address().city()
								);
							};
						}
					],
					'patron_physical_address_state' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.billing_address().state()
								);
							};
						}
					],
					'patron_physical_address_post_code' : [
						['render'],
						function(e) {
							return function() { 
								e.setAttribute('value',
									obj.patron.billing_address().post_code()
								);
							};
						}
					]
				}
			}
		);

		obj.retrieve();

	},

	'retrieve' : function() {

		try {

			var obj = this;

			var chain = [];

			// Retrieve the patron
			chain.push(
				function() {
					try {
						var robj;
						if (obj.barcode && obj.barcode != 'null') {
							robj = obj.network.request(
								api.FM_AU_RETRIEVE_VIA_BARCODE.app,
								api.FM_AU_RETRIEVE_VIA_BARCODE.method,
								[ ses(), obj.barcode ]
							);
						} else if (obj.id && obj.id != 'null') {
							robj = obj.network.simple_request(
								'FM_AU_FLESHED_RETRIEVE_VIA_ID',
								[ ses(), obj.id ]
							);
						} else {
							throw('summary: No barcode or id');
						}
						if (robj) {

							if (instanceOf(robj,au)) {

								obj.patron = robj;
								JSAN.use('patron.util');
								patron.util.set_penalty_css(obj.patron);

							} else {

								throw(robj);

							}
						} else {

							throw(robj);

						}

					} catch(E) {
						throw(E);
					}
				}
			);

			/*
			// Retrieve the survey responses for required surveys
			chain.push(
				function() {
					try {
						var surveys = obj.OpenILS.data.list.my_asv;
						var survey_responses = {};
						for (var i = 0; i < surveys.length; i++) {
							var s = obj.network.request(
								api.FM_ASVR_RETRIEVE.app,
								api.FM_ASVR_RETRIEVE.method,
								[ ses(), surveys[i].id(), obj.patron.id() ]
							);
							survey_responses[ surveys[i].id() ] = s;
						}
						obj.patron.survey_responses( survey_responses );
					} catch(E) {
						var error = ('patron.summary.retrieve : ' + js2JSON(E));
						obj.error.sdump('D_ERROR',error);
						throw(error);
					}
				}
			);
			*/

			// Update the screen
			chain.push( function() { obj.controller.render(); } );

			// On Complete

			chain.push( function() {

				if (typeof window.xulG == 'object' && typeof window.xulG.on_finished == 'function') {
					obj.error.sdump('D_PATRON_SUMMARY',
						'patron.summary: Calling external .on_finished()\n');
					window.xulG.on_finished(obj.patron);
				} else {
					obj.error.sdump('D_PATRON_SUMMARY','patron.summary: No external .on_finished()\n');
				}

			} );

			// Do it
			JSAN.use('util.exec'); obj.exec = new util.exec();
			obj.exec.on_error = function(E) {

				if (typeof window.xulG == 'object' && typeof window.xulG.on_error == 'function') {
					window.xulG.on_error(E);
				} else {
					alert(js2JSON(E));
				}

			}
			this.exec.chain( chain );

		} catch(E) {
			if (typeof window.xulG == 'object' && typeof window.xulG.on_error == 'function') {
				window.xulG.on_error(E);
			} else {
				alert(js2JSON(E));
			}
		}
	}
}

dump('exiting patron.summary.js\n');
