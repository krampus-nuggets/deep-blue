
  // START - Remove images from scraping process

  await tabLauncher.setRequestInterception(true);

  tabLauncher.on('request', (req) => {
    if(req.resourceType() == 'image') {
      req.abort;
    }
    else {
      req.continue();
    }
  })

  // END

