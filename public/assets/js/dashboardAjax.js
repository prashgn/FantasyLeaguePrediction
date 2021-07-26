/*
secondary: #6c757d;
success: #28a745;
info: #17a2b8;
warning: #ffc107;
danger: #dc3545;
light: #f8f9fa;
dark: #343a40;
*/
$(document).ready(function () {
	$('#matchdetail').on('change', function () {
	    $.ajax({
            type: 'GET',
            url: '/dashboardcharts/?matchid=' + $(this).val(),
            success: function (chartdata) {
                var teamcolor = 
                    [
                        ['CSK','#fcce06'],
                        ['DC','#282968'],
                        ['KKR','#3a225d'],
                        ['KXIP','#ed1f27'],
                        ['MI','#004f91'],
                        ['RCB','#e5b582'],
                        ['RR','#e73895'],
                        ['SRH','#9a1c22']
                    ];

                var teamChartData = chartdata[0];
                var momChartData = chartdata[1];
                var scoreAChartData = chartdata[2];
                var scoreBChartData = chartdata[3];

                var style = getComputedStyle(document.body);
                var theme = {};
                /* Bootstrap color properties */
                theme.primary = style.getPropertyValue('--primary');
                theme.secondary = style.getPropertyValue('--secondary');
                theme.success = style.getPropertyValue('--success');
                theme.info = style.getPropertyValue('--info');
                theme.warning = style.getPropertyValue('--warning');
                theme.danger = style.getPropertyValue('--danger');
                theme.light = style.getPropertyValue('--light');
                theme.dark = style.getPropertyValue('--dark');

                var teamAcolor = '';
                var teamBcolor = '';
                for (var i=0; i<teamcolor.length; i++)
                {
                    if (teamcolor[i][0] == teamChartData[0].TeamA)
                        teamAcolor = teamcolor[i][1];
                    if (teamcolor[i][0] == teamChartData[0].TeamB)
                        teamBcolor = teamcolor[i][1];
                }

                google.charts.load('current', {'packages':['corechart']});

                /* Team Performance Data */
                google.charts.setOnLoadCallback(function(){
                    var teamATossPer = Math.trunc((teamChartData[0].TossWonByTeamA / teamChartData[0].MatchPlayedByTeamA) * 100);
                    var teamBTossPer = Math.trunc((teamChartData[0].TossWonByTeamB / teamChartData[0].MatchPlayedByTeamB) * 100);
                    var teamAWonPer  = Math.trunc((teamChartData[0].MatchWonByTeamA / teamChartData[0].MatchPlayedByTeamA) * 100);
                    var teamBWonPer  = Math.trunc((teamChartData[0].MatchWonByTeamB / teamChartData[0].MatchPlayedByTeamB) * 100);

                    var teamdata = 
                        [
                            ['Teams', '', {role:'style'}, {role:'annotation'}],
                            [teamChartData[0].TeamA,
                             teamChartData[0].MatchPlayedByTeamA,
                             teamAcolor,
                             'Matches - ' + teamChartData[0].MatchPlayedByTeamA],
                            [teamChartData[0].TeamA,
                             teamChartData[0].TossWonByTeamA,
                             teamAcolor,
                             'Toss - ' + teamATossPer + '%'],
                            [teamChartData[0].TeamA,
                             teamChartData[0].MatchWonByTeamA,
                             teamAcolor,
                             'Win - ' + teamAWonPer + '%'],
                            [teamChartData[0].TeamB,
                             teamChartData[0].MatchPlayedByTeamB,
                             teamBcolor,
                             'Matches - ' + teamChartData[0].MatchPlayedByTeamB],
                            [teamChartData[0].TeamB,
                             teamChartData[0].TossWonByTeamB,
                             teamBcolor,
                             'Toss - ' + teamBTossPer + '%'],
                            [teamChartData[0].TeamB,
                             teamChartData[0].MatchWonByTeamB,
                             teamBcolor,
                             'Win - ' + teamBWonPer + '%'],
                        ];

                    teamdata = google.visualization.arrayToDataTable(teamdata);
                    var options = 
                        {
                            title: 'Team performance in the tournament',
                            titleTextStyle: { color: theme.light},
                            height:400,
                            bars: 'horizontal',
                            legend: { position: 'none' },
                            chartArea: { backgroundColor: theme.secondary, width: '80%' },
                            backgroundColor: theme.dark,
                            hAxes: { 0: { textStyle: { color: theme.light } } },
                            vAxes: { 0: { textStyle: { color: theme.light } } },
                            hAxis: { gridlines: { color: theme.dark }, format: '##' },
                            vAxis: { gridlines: { color: theme.dark } },
                        };
                    var chart = new google.visualization.BarChart(document.getElementById('dashboardteam'));
                    chart.draw(teamdata,options);
                });

                /* MOM Data */
                google.charts.setOnLoadCallback(function(){
                    var momdata = [];
                    momdata.push(['Team', 'Times', {role:'style'}, {role:'annotation'}]);
                    for (var i=0; i<momChartData.length; i++)
                    {
                        var color;
                        for (var j=0; j<teamcolor.length; j++)
                        {
                            if (teamcolor[j][0] == momChartData[i].TeamName)
                                color = teamcolor[j][1];
                        }

                        momdata.push([momChartData[i].TeamName, 
                                      momChartData[i].MOMCount,
                                      color,
                                      momChartData[i].PlayerName + ' (' + 
                                      momChartData[i].MOMCount + ')']);
                    }

                    momdata = google.visualization.arrayToDataTable(momdata);
                    var options = 
                        {
                            title: 'MOM from both teams',
                            titleTextStyle: { color: theme.light},
                            bars: 'horizontal',
                            legend: { position: 'none' },
                            chartArea: { backgroundColor: theme.secondary, width: '80%' },
                            backgroundColor: theme.dark,
                            hAxes: { 0: { textStyle: { color: theme.light } } },
                            vAxes: { 0: { textStyle: { color: theme.light } } },
                            hAxis: { gridlines: { color: theme.dark }, format: '##' },
                            vAxis: { gridlines: { color: theme.dark } },
                        };
                    var chart = new google.visualization.BarChart(document.getElementById('dashboardmom'));
                    chart.draw(momdata, options);
                });

                /* 1st Inning Score */
                google.charts.setOnLoadCallback(function(){
                    var teamAscore = [];
                    for (var i=0; i<scoreAChartData.length; i++) {
                        if (scoreAChartData[i].Rule == '4') {
                            teamAscore.push([scoreAChartData[i].Team,scoreAChartData[i].TeamA,scoreAChartData[i].TeamB,scoreAChartData[i].Value]);
                        }
                    }

                    var teamBscore = [];
                    for (var i=0; i<scoreBChartData.length; i++) {
                        if (scoreBChartData[i].Rule == '4') {
                            teamBscore.push([scoreBChartData[i].Team,scoreBChartData[i].TeamA,scoreBChartData[i].TeamB,scoreBChartData[i].Value]);
                        }
                    }

                    var scoredata = [];
                    scoredata.push(['Matches', 'Team Score', {role:'style'}, 'Team Score', {role:'style'}]);

                    /* Run the iteration maximum time for 2 different results */
                    var iMaxIter = Math.max(teamAscore.length,teamBscore.length);

                    for(var i=0; i<iMaxIter; i++)
                    {
                        var teamAdata;
                        var teamBdata;
                        if (typeof teamAscore[i] == 'undefined' ) {
                            teamAdata = null;
                        } else {
                            teamAdata = teamAscore[i][3];
                        }

                        if (typeof teamBscore[i] == 'undefined' ) {
                            teamBdata = null;
                        } else {
                            teamBdata = teamBscore[i][3];
                        }
                        scoredata.push([scoredata.length,teamAdata,teamAcolor,teamBdata,teamBcolor]);
                    }

                    scoredata = google.visualization.arrayToDataTable(scoredata);
                    var options = 
                        {
                            title: 'All the 1st inning scores where the teams played',
                            curveType: 'function',
                            titleTextStyle: { color: theme.light},
                            legend: { position: 'none' },
                            pointSize: 10,
                            series: { 0: { pointShape: 'circle' }, 1: { pointShape: 'circle' } },
                            chartArea: { backgroundColor: theme.secondary, width: '80%' },
                            backgroundColor: theme.dark,
                            lineWidth: 5,
                            hAxes: { 0: { textStyle: { color: theme.light } } },
                            vAxes: { 0: { textStyle: { color: theme.light } } },
                            hAxis: { gridlines: { color: theme.dark }, format: '##' },
                            vAxis: { gridlines: { color: theme.dark }, format: '##', ticks: [100,125,150,175,200,225,250] },
                        };
                    var chart = new google.visualization.LineChart(document.getElementById('dashboardscore'));
                    chart.draw(scoredata, options);
                });

                /* 1st Inning Wicket */
                google.charts.setOnLoadCallback(function(){
                    var teamAwicket = [];
                    for (var i=0; i<scoreAChartData.length; i++) {
                        if (scoreAChartData[i].Rule == '5') {
                            teamAwicket.push([scoreAChartData[i].Team,scoreAChartData[i].TeamA,scoreAChartData[i].TeamB,scoreAChartData[i].Value]);
                        }
                    }

                    var teamBwicket = [];
                    for (var i=0; i<scoreBChartData.length; i++) {
                        if (scoreBChartData[i].Rule == '5') {
                            teamBwicket.push([scoreBChartData[i].Team,scoreBChartData[i].TeamA,scoreBChartData[i].TeamB,scoreBChartData[i].Value]);
                        }
                    }

                    var wicketdata = [];
                    wicketdata.push(['Matches', 
                                     'Team Wicket', 
                                     {role:'style'}, 
                                     'Team Wicket', 
                                     {role:'style'}]);

                    /* Run the iteration maximum time for 2 different results */
                    var iMaxIter = Math.max(teamAwicket.length,teamBwicket.length);

                    for(var i=0; i<iMaxIter; i++)
                    {
                        var teamAdata;
                        var teamBdata;

                        if (typeof teamAwicket[i] == 'undefined' ) {
                            teamAdata = null;
                        } else {
                            teamAdata = teamAwicket[i][3];
                        }

                        if (typeof teamBwicket[i] == 'undefined' ) {
                            teamBdata = null;
                        } else {
                            teamBdata = teamBwicket[i][3];
                        }
                        wicketdata.push([wicketdata.length,
                                         teamAdata,
                                         teamAcolor,
                                         teamBdata,
                                         teamBcolor]);
                    }

                    wicketdata = google.visualization.arrayToDataTable(wicketdata);
                    var options = 
                        {
                            title: 'All the 1st inning wickets where the teams played',
                            curveType: 'function',
                            titleTextStyle: { color: theme.light},
                            legend: { position: 'none' },
                            pointSize: 10,
                            series: { 0: { pointShape: 'circle' }, 1: { pointShape: 'circle' } },
                            chartArea: { backgroundColor: theme.secondary, width: '80%' },
                            backgroundColor: theme.dark,
                            lineWidth: 5,
                            hAxes: { 0: { textStyle: { color: theme.light } } },
                            vAxes: { 0: { textStyle: { color: theme.light } } },
                            hAxis: { gridlines: { color: theme.dark }, format: '##' },
                            vAxis: { gridlines: { color: theme.dark }, format: '##' , ticks: [0,2,4,6,8,10]},
                        };
                    var chart = new google.visualization.LineChart(document.getElementById('dashboardwicket'));
                    chart.draw(wicketdata, options);

                });
            }
        });
	});
    $('#matchdetail').trigger('change');
});