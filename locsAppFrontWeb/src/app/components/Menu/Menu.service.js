(function () {

  'use strict';

  angular
    .module('LocsappServices')
    .factory('MenuService', MenuService);

  /** @ngInject */
  function MenuService($location) {

    var sections = [{
      name: 'Search',
      state: 'main.homepage',
      type: 'link'
    }];

    sections.push({
      name: 'Create an article',
      state: 'main.article_create',
      type: 'link'
    });


    sections.push({
      name: 'My articles',
      type: 'toggle',
      pages: [{
        name: 'Current requests',
        type: 'link',
        state: 'main.article_requests',
        icon: ''
      }, {
        name: 'Current articles',
        state: 'main.homepage',
        type: 'link',
        icon: ''
      },
        {
          name: 'Timeline',
          state: 'main.article_timelines',
          type: 'link',
          icon: ''
        },

        {
          name: 'Notation',
          state: 'main.article_notations',
          type: 'link',
          icon: ''
        }]
    });


    sections.push({
      name: 'My questions',
      type: 'toggle',
      pages: [{
        name: 'Questions I have asked',
        type: 'link',
        state: 'main.questions',
        icon: ''
      }, {
        name: 'Questions to answer',
        state: 'main.questions',
        type: 'link',
        icon: ''
      }]
    });


    sections.push({
      name: 'My bookmarks',
      type: 'toggle',
      pages: [{
        name: 'My articles',
        type: 'link',
        state: 'main.favorites',
        icon: ''
      }, {
        name: 'My searches',
        state: 'main.favorites',
        type: 'link',
        icon: ''
      }]
    });


    sections.push({
      name: 'My account',
      type: 'toggle',
      pages: [{
        name: 'My informations',
        type: 'link',
        state: 'main.user_profile',
        icon: ''
      }, {
        name: 'Edit profile',
        state: 'main.profile_management',
        type: 'link',
        icon: ''
      },
        {
          name: 'History notation',
          state: 'main.history_notations',
          type: 'link',
          icon: ''
        },

        {
          name: 'History articles',
          state: 'main.history_articles',
          type: 'link',
          icon: ''
        }]
    });

    sections.push({
      name: 'Logout',
      state: 'main.logout',
      type: 'link'
    });

    var self;

    return self = {
      sections: sections,

      toggleSelectSection: function (section) {
        self.openedSection = (self.openedSection === section ? null : section);
      },
      isSectionSelected: function (section) {
        return self.openedSection === section;
      },

      selectPage: function (section, page) {
        page && page.url && $location.path(page.url);
        self.currentSection = section;
        self.currentPage = page;
      }
    };

    /*function sortByHumanName(a, b) {
     return (a.humanName < b.humanName) ? -1 :
     (a.humanName > b.humanName) ? 1 : 0;
     }*/


  }
})();
