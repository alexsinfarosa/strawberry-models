import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import "./Test.styl";

@inject("store")
@observer
export default class Test extends Component {
  render() {
    return (
      <div>

        <h1>Header</h1>

        <main>
          <div className="paddings">

            <article>
              Main article text
            </article>

            <aside>
              <a class="toggler">XXX</a>

              <section class="about">One</section>
              <section class="contacts">Two</section>
              <section class="categories">Three</section>

            </aside>

          </div>
        </main>
      </div>
    );
  }
}
