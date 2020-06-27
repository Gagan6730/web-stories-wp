/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { initHelpers } from './_utils';

describe('CUJ: Editor Can Style Text', () => {
  describe('Action: Inline selection', () => {
    const data = {};

    const {
      getTextContent,
      addInitialText,
      setSelection,
      richTextHasFocus,
    } = initHelpers(data);

    beforeEach(async () => {
      data.fixture = new Fixture();
      await data.fixture.render();

      // Add a text box
      await addInitialText();
    });

    afterEach(() => {
      data.fixture.restore();
    });

    it('should have the correct initial text and formatting', () => {
      expect(getTextContent()).toBe('Fill in some text');
    });

    it('should apply inline formats correctly for both single style and multiple styles', async () => {
      const {
        bold,
        italic,
        underline,
        fontWeight,
        letterSpacing,
        fontColor,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Enter edit-mode
      await data.fixture.events.keyboard.press('Enter');

      // Select character 5 and 6 (the word "in" in "Fill in some text")
      await setSelection(5, 7);

      // Check all styles are default
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);
      expect(fontWeight.value).toBe('Regular');
      expect(letterSpacing.value).toBe('0%');
      expect(fontColor.hex.value).toBe('000000');

      // Toggle italic and underline - wait for autofocus to return
      await data.fixture.events.click(italic.button);
      await richTextHasFocus();
      await data.fixture.events.click(underline.button);
      await richTextHasFocus();

      // Set font weight (should also toggle bold, as "Black" is >700)
      // - wait for autofocus to return
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Black'));
      await richTextHasFocus();

      // Set letter spacing
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('50');
      // Press escape to leave input field (does not leave edit-mode)
      await data.fixture.events.keyboard.press('Escape');

      // Set color using hex input
      await data.fixture.events.click(fontColor.hex, { clickCount: 3 });
      await data.fixture.events.keyboard.type('FF00FF');
      // Press escape to leave input field (does not leave edit-mode)
      await data.fixture.events.keyboard.press('Escape');
      // */

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      expect(fontWeight.value).toBe('Black');
      expect(letterSpacing.value).toBe('50%');
      expect(fontColor.hex.value).toBe('FF00FF');

      // Move selection to characters 6-9 (partially overlapping new styles and no styles)
      await setSelection(6, 9);

      // Verify that the toggles are off (as to be expected with mixed styles)
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);

      // Expect font weight, letter spacing and font color to be "multiple"
      expect(fontWeight.value).toBe('(multiple)');
      expect(letterSpacing.value).toBe('');
      expect(letterSpacing.placeholder).toBe('multiple');
      expect(fontColor.output).toBe('Multiple');

      // Now toggle all toggles, and set new color and letter spacing
      await data.fixture.events.click(italic.button);
      await richTextHasFocus();
      await data.fixture.events.click(underline.button);
      await richTextHasFocus();
      await data.fixture.events.click(bold.button);
      await richTextHasFocus();

      // We have to open the color picker, as there's no direct hex input when "multiple"
      await data.fixture.events.click(fontColor.button);
      waitFor(() => fontColor.picker);
      await data.fixture.events.click(fontColor.picker.hexButton);
      await data.fixture.events.keyboard.type('00FF00');

      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('100');
      await data.fixture.events.keyboard.press('Escape');

      // Verify all styles again
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      // Note that entire selection is made black, because some part was black, when bold was pressedexpect(fontWeight.value).toBe('Black');
      expect(letterSpacing.value).toBe('100%');
      expect(fontColor.hex.value).toBe('00FF00');

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Assume text content to match expectation
      const actual = getTextContent();
      const firstCSS = [
        'font-weight: 900',
        'font-style: italic',
        'text-decoration: underline',
        'color: #f0f',
        'letter-spacing: 0.5em',
      ].join('; ');
      const secondCSS = [
        'font-weight: 900',
        'font-style: italic',
        'text-decoration: underline',
        'color: #0f0',
        'letter-spacing: 1em',
      ].join('; ');
      const expected = `Fill <span style="${firstCSS}">i</span><span style="${secondCSS}">n</span><span style="${secondCSS}"> s</span>ome text`;
      expect(actual).toBe(expected);
    });

    it('should apply inline formats using shortcuts', async () => {
      const {
        bold,
        italic,
        underline,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Enter edit-mode
      await data.fixture.events.keyboard.press('Enter');

      // Select character 5 and 6 (the word "in" in "Fill in some text")
      await setSelection(5, 7);

      // Check all styles are default
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);

      // Toggle italic, underline and bold using shortcut
      await data.fixture.events.keyboard.shortcut('mod+u');
      await data.fixture.events.keyboard.shortcut('mod+i');
      await data.fixture.events.keyboard.shortcut('mod+b');

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Assume text content to match expectation
      const actual = getTextContent();
      const firstCSS = [
        'font-weight: 700',
        'font-style: italic',
        'text-decoration: underline',
      ].join('; ');
      const expected = `Fill <span style="${firstCSS}">in</span> some text`;
      expect(actual).toBe(expected);
    });

    describe('when there is a mix of font weights', () => {
      beforeEach(async () => {
        const {
          fontWeight,
        } = data.fixture.editor.inspector.designPanel.textStyle;

        // Enter edit-mode
        await data.fixture.editor.canvas.waitFocusedWithin();
        await data.fixture.events.keyboard.press('Enter');

        const selectFontWeight = async (weight) => {
          await data.fixture.events.click(fontWeight.select);
          await data.fixture.events.click(fontWeight.option(weight));
          await richTextHasFocus();
        };

        // Select first character and make it black (900)
        await setSelection(0, 1);
        await selectFontWeight('Black');

        // Select second character and make it bold (700)
        await setSelection(1, 2);
        await selectFontWeight('Bold');
      });

      it('should make black+bold selection non-bold when toggling', async () => {
        const {
          bold,
          fontWeight,
        } = data.fixture.editor.inspector.designPanel.textStyle;

        // Select first two characters (900 and 700)
        await setSelection(0, 2);

        // Check that bold toggle is on but font weight is "multiple"
        expect(bold.checked).toBe(true);
        expect(fontWeight.value).toBe('(multiple)');

        // Toggle it by pressing the bold button
        await data.fixture.events.click(bold.button);

        // Verify bold is now off and font weight is Regular
        expect(bold.checked).toBe(false);
        expect(fontWeight.value).toBe('Regular');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Assume text content to now be formatting-free
        const actual = getTextContent();
        const expected = `Fill in some text`;
        expect(actual).toBe(expected);
      });

      it('should make bold+regular selection bold when toggling', async () => {
        const {
          bold,
          fontWeight,
        } = data.fixture.editor.inspector.designPanel.textStyle;

        // Select second and third characters (700 and 400)
        await setSelection(1, 3);

        // Check that bold toggle is off but font weight is "multiple"
        expect(bold.checked).toBe(false);
        expect(fontWeight.value).toBe('(multiple)');

        // Toggle it by pressing the bold button
        await data.fixture.events.click(bold.button);

        // Verify bold is now on and font weight is Bold
        expect(bold.checked).toBe(true);
        expect(fontWeight.value).toBe('Bold');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Assume text content to be correctly formatted
        const actual = getTextContent();
        const expected = `<span style="font-weight: 900">F</span><span style="font-weight: 700">il</span>l in some text`;
        expect(actual).toBe(expected);
      });

      it('should make black+bold+regular selection black when toggling', async () => {
        const {
          bold,
          fontWeight,
        } = data.fixture.editor.inspector.designPanel.textStyle;

        // Select first three characters (900, 700 and 400)
        await setSelection(0, 3);

        // Check that bold toggle is off but font weight is "multiple"
        expect(bold.checked).toBe(false);
        expect(fontWeight.value).toBe('(multiple)');

        // Toggle it by pressing the bold button
        await data.fixture.events.click(bold.button);

        // Verify bold is now on and font weight is Black
        expect(bold.checked).toBe(true);
        expect(fontWeight.value).toBe('Black');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Assume text content to be correctly formatted
        const actual = getTextContent();
        const expected = `<span style="font-weight: 900">Fil</span>l in some text`;
        expect(actual).toBe(expected);
      });
    });

    it('should apply global formats (here line height) even when a selection is present', async () => {
      // Expect line height to be default "Roboto"
      const getDisplayTextStyles = () => {
        const displayNode = data.fixture.editor.canvas.displayLayer.display(
          data.textId
        ).node;
        const paragraph = displayNode.querySelector('p');
        return window.getComputedStyle(paragraph);
      };
      const initialLineHeight = parseFloat(getDisplayTextStyles().lineHeight);

      const {
        lineHeight,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Enter edit-mode
      await data.fixture.events.keyboard.press('Enter');

      // Select something
      await setSelection(5, 7);

      // Change line height to 5
      await data.fixture.events.click(lineHeight, { clickCount: 3 });
      await data.fixture.events.keyboard.type('5');
      await data.fixture.events.keyboard.press('Escape');

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Expect text content to be unchanged
      expect(getTextContent()).toBe('Fill in some text');

      // Expect line height to have changed
      expect(getDisplayTextStyles().lineHeight).not.toBe(initialLineHeight);
    });
  });
});
