$(document).ready(function () {
    $('#leagues tbody tr').on('click', function () {
        window.location.href = '/leaguedetail/' + $(this).children('td').children('input').val();
    });

    $('[name="btnPredict"]').on('click', function () {
        var item = $(this).parent().children('input').val();
        $.ajax({
            type: 'get',
            url: '/predict/?item=' + item,
            success: function (data) {
                let predict = data[0];
                let rules = data[1];
                let playerdet = data[2];
                //console.log(playerdet);
                $('#predictForm').empty();

                var formFields = '';
                if (rules.length < 1) {
                    formFields = formFields + '<span>No rule found</span>';
                } else {
                    for (var i = 0; i < rules.length; i++) {
                        formFields =
                            formFields +
                            "<label class='mt-3' for='rule" +
                            rules[i].id +
                            "'>" +
                            rules[i].name +
                            '</label>';
                        if (rules[i].selection === null) {
                            formFields =
                                formFields +
                                "<input type='number' min='0' class='form-control input-group-sm' id='rule" +
                                rules[i].id +
                                "'/>";
                        } else {
                            formFields =
                                formFields +
                                "<select class='custom-select input-group-sm' id='rule" +
                                rules[i].id +
                                "'><option selected>Choose value...</option>";

                            if (rules[i].selection == 'player') {
                                for (var j = 0; j < playerdet.length; j++) {
                                    formFields =
                                        formFields +
                                        "<option value='" +
                                        playerdet[j].playerid +
                                        "'>" +
                                        playerdet[j].playername +
                                        " (<span style='font-size: 10px;'>" +
                                        playerdet[j].teamname +
                                        '</span>)' +
                                        '</option>';
                                }
                            } else {
                                var unique = '';
                                for (var j = 0; j < playerdet.length; j++) {
                                    if (unique != playerdet[j].teamname) {
                                        unique = playerdet[j].teamname;
                                        formFields =
                                            formFields +
                                            "<option value='" +
                                            playerdet[j].teamid +
                                            "'>" +
                                            unique +
                                            '</option>';
                                    }
                                }
                            }

                            formFields = formFields + '</select>';
                        }
                    }
                }
                formFields = formFields + "<input type='hidden' id='matchid' value='" + item + "'>";

                $('#predictForm').append(formFields); // Append the new elements
                for (var i = 0; i < predict.length; i++) {
                    $('#rule' + predict[i].fk_r_id).val(predict[i].predict_value);
                }
            },
        });
    });

    $('#predictSubmit').on('click', function () {
        if ($('#rule4').val() > 300) {
            $('#alert').text('Maximum value for score can be 300');
            $('#alert').collapse('show');
            return;
        }
        if ($('#rule5').val() > 10) {
            $('#alert').text('Maximum value for wicket can be 10');
            $('#alert').collapse('show');
            return;
        }
        $('#alert').collapse('hide');
        var formData = {};
        $('#predictForm input, #predictForm select').each(function (index) {
            formData[$(this).attr('id')] = $(this).val();
        });

        $.ajax({
            type: 'POST',
            url: '/predict',
            data: formData,
            success: function (data) {
                //do something with the data via front-end framework
                //location.reload();
                $('#modalPredict').modal('hide');
            },
        });

        return false;
    });

    $('[name="btnResult"]').on('click', function () {
        var item = $(this).parent().children('input').val();
        $.ajax({
            type: 'get',
            url: '/result/?item=' + item,
            success: function (data) {
                let result = data;
                /*let teamdata = data[1];
                let playerdata = data[2];*/

                $('#resultdiv').empty();

                var divFields = '';
                if (result.length < 1) {
                    divFields = divFields + '<span>No data found</span>';
                } else {
                    divFields =
                        divFields +
                        '<table class="table col-sm-12 text-white" style="font-size:10px">' +
                        '<tr class="bg-light text-dark font-weight-bold">' +
                        '    <td>Rule</td>' +
                        '    <td>Prediction</td>' +
                        '    <td>Result</td>' +
                        '    <td>Score</td>' +
                        '</tr>';
                    for (var i = 0; i < result.length; i++) {
                        divFields =
                            divFields +
                            '<tr>' +
                            '    <td>' +
                            result[i].rulename +
                            '</td>' +
                            '    <td>' +
                            result[i].predictvalue +
                            '</td>' +
                            '    <td>' +
                            result[i].resultvalue +
                            '</td>' +
                            '    <td>' +
                            result[i].score +
                            '</td>' +
                            '</tr>';
                    }
                    divFields = divFields + '</table>';
                }
                $('#resultdiv').append(divFields); // Append the new elements
            },
        });
    });
});