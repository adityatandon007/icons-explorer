<template>
  <div class="footer-wrapper">
    <footer>
      <b-container>
        <b-row class="py-5 py-8 justify-content-between d-flex logo-row">
          <div class="d-flex align-items-center">
            <img src="~/assets/img/iconscout-logo.svg" alt="IconScout Logo" height="44" class="mr-3" /> 
            <span class="text-secondary">Design Resource Marketplace</span>
          </div>
          <span class="lead text-secondary align-self-center">
            <em class="text-primary-dark">5,663,871</em> graphic resources &amp; counting
          </span>
        </b-row>
        <b-row class="d-flex justify-content-between py-6">
          <b-col lg="2">
            <div class="h5 mb-5">Graphic Resources</div>
            <b-nav vertical class="list-unstyled footer-links">
              <b-nav-item>Free Icons</b-nav-item>
              <b-nav-item>Free Emoji Icons</b-nav-item>
              <b-nav-item>Free Logo Icons</b-nav-item>
              <b-nav-item>iOS Icons</b-nav-item>
              <b-nav-item>Sticker Icons</b-nav-item>
              <b-nav-item>Gradient Icons</b-nav-item>
              <b-nav-item>Curated Bundle</b-nav-item>
              <b-nav-item>Calendar of Festival</b-nav-item>
              <b-nav-item>Free Assets of the day</b-nav-item>
              <b-nav-item>Explore Design Assets</b-nav-item>
            </b-nav>
          </b-col>
          <b-col lg="2">
            <div class="h5 mb-5">Products</div>
            <b-nav vertical class="list-unstyled footer-links">
              <b-nav-item>Unicon Icon Font</b-nav-item>
              <b-nav-item>Color editor</b-nav-item>
              <b-nav-item>Apps & Plugins</b-nav-item>
              <b-nav-item>Hire designers</b-nav-item>
              <b-nav-item>IconScout API</b-nav-item>
              <b-nav-item>Top Illustrations</b-nav-item>
              <b-nav-item>Top 3D Assets</b-nav-item>
              <b-nav-item>Reverse Image Search</b-nav-item>
              <b-nav-item>Free Assets of the day</b-nav-item>
              <b-nav-item>Unicon Plugin for Figma</b-nav-item>
            </b-nav>
          </b-col>
          <b-col lg="2">
            <div class="h5 mb-5">Company</div>
            <b-nav vertical class="list-unstyled footer-links">
              <b-nav-item>Blog</b-nav-item>
              <b-nav-item>About</b-nav-item>
              <b-nav-item>Access features</b-nav-item>
              <b-nav-item>Sell on IconScout</b-nav-item>
              <b-nav-item>Startup program</b-nav-item>
              <b-nav-item>We're hiring</b-nav-item>
            </b-nav>
          </b-col>
          <b-col lg="2">
            <div class="h5 mb-5">Legal</div>
            <b-nav vertical class="list-unstyled footer-links">
              <b-nav-item>Terms of use</b-nav-item>
              <b-nav-item>Privacy policy</b-nav-item>
              <b-nav-item>License agreeement</b-nav-item>
              <b-nav-item>Contributor terms</b-nav-item>
              <b-nav-item>Support center</b-nav-item>
              <b-nav-item>Join discord community</b-nav-item>
            </b-nav>
          </b-col>
          <b-col lg="auto">
            <div class="h5 mb-5">Get IconScout for desktop</div>
            <div class="mb-5">
              <img src="~/assets/img/download-desktop.svg" alt="Desktop App" />
            </div>
            <div class="mr-5">
              <div class="h5 mb-5">Get LottieFiles mobile app</div>
              <div class="mb-5">
                <img src="~/assets/img/download-app-store.svg" alt="Download from App Store" width="120" height="40" />
                <img src="~/assets/img/download-google-play.svg" alt="Download from Google Play Store" width="130" height="40" />
              </div>
            </div>
            <div class="mt-0">
              <div class="h5 mb-5">Follow us</div>
              <div>
                <img src="~/assets/img/social-icons.svg" alt="Social icons" />
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <div class="copyrights text-secondary">
        <b-container class="py-3">
          <b-row>
            <b-col lg="6" class="d-flex align-items-center">
              <div>
                <div class="text-muted">
                  © 2021 Design Barn Inc. Made with
                  <span>
                    <img src="~/assets/img/made-with-love.svg" />
                  </span>
                  in
                  <span class="position-absolute ml-2">India</span>
                </div>
              </div>
            </b-col>
            <b-col lg="6" class="d-flex align-items-center justify-content-start justify-content-end">
              <span class="d-flex align-items-center">
                <img src="~/assets/img/secure-stripe.svg" />
              </span>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
.footer-wrapper {
  background: #EBEDF5;
  .logo-row {
    border-bottom: 1px solid #D8DBEB;
  }
  .footer-links > li {
    margin-top: 0;
    margin-bottom: 0.75rem;
    a {
      color: #596080;
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.5rem;
      padding: 0;
      &:hover {
        color: #000;
        text-decoration: none;
      }
    }
  }
  .copyrights {
    background-color: #D8DBEB;
  }
}
</style>