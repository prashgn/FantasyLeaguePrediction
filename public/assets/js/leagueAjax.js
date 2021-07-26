$(document).ready(function () {
    $('#leagues tbody tr').on('click', function () {
        window.location.href = '/leaguedetail/' + $(this).children('td').children('input').val();
    });

    $('#createleague').on('click', function () {
        $('#createLeagueMsg').css('display', 'none');
        $('#createLeagueForm').trigger('reset');
        $.ajax({
            type: 'get',
            url: '/createleague',
            success: function (data) {
                $('#seriesName').empty();
                $('#seriesName').append(new Option('Choose value...', ''));
                for (var i = 0; i < data.length; i++) {
                    $('#seriesName').append(new Option(data[i].seriesname, data[i].seriesid));
                }
            },
        });
    });

    $('#createLeagueSubmit').on('click', function () {
        if ($('#createLeagueName').val() == '') {
            $('#createLeagueMsg').css('display', 'block');
            $('#createLeagueMsg').text('League Name is required.');
        } else if ($('#seriesName').val() == '') {
            $('#createLeagueMsg').css('display', 'block');
            $('#createLeagueMsg').text('Series Name is required.');
        } else {
            var formData = {};
            formData[$('#createLeagueName').attr('id')] = $('#createLeagueName').val();
            formData[$('#seriesName').attr('id')] = $('#seriesName').val();

            $.ajax({
                type: 'POST',
                url: '/createleague',
                data: formData,
                success: function (data) {
                    //do something with the data via front-end framework
                    //location.reload();
                    if (data.message != null && data.message == '') {
                        $('#createLeagueMsg').css('display', 'none');
                        $('#createLeagueMsg').text('');
                        $('#modalCreateLeague').modal('hide');
                        location.reload();
                    } else {
                        $('#createLeagueMsg').css('display', 'block');
                        $('#createLeagueMsg').text(data.message);
                    }
                },
            });
        }
        return false;
    });

    $('#joinleague').on('click', function () {
        $('#joinLeagueMsg').css('display', 'none');
        $('#joinLeagueForm').trigger('reset');
    });

    $('#joinLeagueSubmit').on('click', function () {
        if ($('#joinLeagueName').val() == '') {
            $('#joinLeagueMsg').text('League Name is required.');
        } else {
            var formData = {};
            formData[$('#joinLeagueName').attr('id')] = $('#joinLeagueName').val();

            $.ajax({
                type: 'POST',
                url: '/joinleague',
                data: formData,
                success: function (data) {
                    //do something with the data via front-end framework
                    //location.reload();
                    if (data.message != null && data.message == '') {
                        $('#joinLeagueMsg').css('display', 'none');
                        $('#joinLeagueMsg').text('');
                        $('#modalJoinLeague').modal('hide');
                        location.reload();
                    } else {
                        $('#joinLeagueMsg').css('display', 'block');
                        $('#joinLeagueMsg').text(data.message);
                    }
                },
            });
        }
        return false;
    });
});