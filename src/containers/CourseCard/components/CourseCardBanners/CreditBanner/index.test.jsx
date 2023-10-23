import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';

import hooks from './hooks';
import messages from './messages';
import CreditBanner from '.';
import { MailtoLink } from '@edx/paragon';

jest.mock('components/Banner', () => 'Banner');

jest.mock('./hooks', () => ({
  useCreditBannerData: jest.fn(),
}));

let el;
const cardId = 'test-card-id';

const ContentComponent = () => 'ContentComponent';
const supportEmail = 'test-support-email';

describe('CreditBanner component', () => {
  describe('behavior', () => {
    beforeEach(() => {
      hooks.useCreditBannerData.mockReturnValue(null);
      el = shallow(<CreditBanner cardId={cardId} />);
    });
    it('initializes hooks with cardId', () => {
      expect(hooks.useCreditBannerData).toHaveBeenCalledWith(cardId);
    });
    it('returns null if hookData is null', () => {
      expect(el.isEmptyRender()).toEqual(true);
    });
  });
  describe('render', () => {
    describe('with error state', () => {
      beforeEach(() => {
        hooks.useCreditBannerData.mockReturnValue({
          error: true,
          ContentComponent,
          supportEmail,
        });
        el = shallow(<CreditBanner cardId={cardId} />);
      });
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
      it('passes danger variant to Banner parent', () => {
        expect(el.find('Banner').props().variant).toEqual('danger');
      });
      it('includes credit-error-msg with support email link', () => {
        expect(el.find('.credit-error-msg').containsMatchingElement(
          formatMessage(messages.error, {
            supportEmailLink: (<MailtoLink address={supportEmail} />),
          }), 
        )).toEqual(true);
      });
      it('loads ContentComponent with cardId', () => {
        expect(el.find('ContentComponent').props().cardId).toEqual(cardId);
      });
    });
    describe('with no error state', () => {
      beforeEach(() => {
        hooks.useCreditBannerData.mockReturnValue({
          error: false,
          ContentComponent,
          supportEmail,
        });
        el = shallow(<CreditBanner cardId={cardId} />);
      });
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
      it('loads ContentComponent with cardId', () => {
        expect(el.find('ContentComponent').props().cardId).toEqual(cardId);
      });
    });
  });
});
