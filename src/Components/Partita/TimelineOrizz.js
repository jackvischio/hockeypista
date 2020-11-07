import React, { Component } from 'react'

export default class TimelineOrizz extends Component {
    render() {
        return (
            <>
                <div class="row d-none d-md-block">
                    <div class="col col-12">
                        <div class="card" style="margin-bottom: 0; padding-right: 1em;">
                            <div class="card-body">
                                <table class="timeline-oriz">
                                    <tbody>
                                        <tr>
                                            <td class="head">
                                                <img class="tl-teamA-logo" src="" style="width: 30px" />
                                                <h6 class="tl-teamA-name" style="margin: 5px 0 0 0"></h6>
                                            </td>
                                            <td>
                                                <div class="tl-oriz-cont tl-top" id="timeline-oriz-A">

                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div class="tl-oriz-sep" id="timeline-oriz-sep">
                                                    <hr/>
                                                    <div class="tl-label" style="left: 0"> 0 </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="head">
                                                <img class="tl-teamB-logo" src="" style="width: 30px" />
                                                <h6 class="tl-teamB-name" style="margin: 5px 0 0 0"></h6>
                                            </td>
                                            <td>
                                                <div class="tl-oriz-cont tl-bottom" id="timeline-oriz-B">

                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
