/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-24 09:37:56
 * @LastEditTime: 2021-02-24 14:04:47
 * @Description: file content
 */
import format from 'date-format';

const borderColorDefault = '#096dd9'
const bgColorDefault = '#1890ff'
const bgColorList = ['#52c41a', '#13c2c2', '#2f54eb', '#722ed1', '#eb2f96']
const borderColorList = ['#389e0d', '#08979c', '#1d39c4', '#531dab', '#c41d7f']

const TimeStyle = `
  color:#595959;
  font-weight:700;
  font-size:13px
`;
const LabelStyle = (borderColor) => `
  border: 1px solid ${borderColor};
  font-size:13px;
  background: ${borderColor};
  color: rgb(255, 255, 255);
  font-weight:100;
  padding:0 4px
`
const TitleStyle = (borderColor, bgColor) => `
  border: 1px solid ${borderColor};
  font-size:13px;
  background: ${bgColor};
  color: rgb(255, 255, 255);
  font-weight:100
`
const BorderStyle = `
  border-left: 1px solid #000;
  padding:2px 0;
  margin-left:5.5px
`
const paraColor = 'color:#69c0ff';
const multiColor = 'color:#5cdbd3';

export function $debug({
  color,
  title,
  para,
  multi,
  label = '',
}) {
  let bgColor
  let borderColor
  switch (typeof color) {
    case 'number':
      if (color > 0 && color <= bgColorList.length) {
        bgColor = bgColorList[color - 1];
        borderColor = borderColorList[color - 1];
      }
      break
    case 'string':
      bgColor = color;
      // TODO: dark
      borderColor = borderColorDefault;
      break
    default:
      bgColor = bgColorDefault;
      borderColor = borderColorDefault;
      break
  }

  const time = format('hh:mm:ss.SSS', new Date());
  const labelStyle = label.length > 0 ? LabelStyle(borderColor) : ''
  const titleStyle = TitleStyle(borderColor, bgColor);

  const entries = Object.entries(multi ?? {});
  const paraMaxLength = entries.reduce(
    (a, [k]) => (a < k.length ? k.length : a),
    typeof para === 'string' ? para.length : 10,
  );
  const paraTitle = 'parameters';

  let pattern = '%s%c %s %c%s%c%s%c';
  const parameters = [
    '🔰',
    TimeStyle,
    time,
    labelStyle,
    label,
    titleStyle,
    ` ${title} `,
    '', // 清除 titleStyle 的影响
  ];

  if (para) {
    pattern += '%s%c%s%c %s  %o';
    parameters.push(
      '\n',
      BorderStyle,
      ' ',
      paraColor,
      paraTitle.padEnd(paraMaxLength, ' '),
      para,
    );
  }

  if (typeof multi === 'object') {
    for (const [k, v] of entries) {
      pattern += '%s%c%s%c %s  %o';
      parameters.push(
        '\n',
        BorderStyle,
        ' ',
        multiColor,
        k.padEnd(paraMaxLength, ' '),
        v,
      );
    }
  }

  return [pattern, ...parameters]
}

const TitleStyleLog = (borderColor) => `
  border: 2px solid transparent;
  border-right:none;
  border-left:none;
  background: ${borderColor};
  color: rgb(255, 255, 255);
  font-weight:100
`;
const SubTitleStyle = (bgColor) => `
  border: 2px solid transparent;
  background: ${bgColor};
  color: rgb(255, 255, 255);
  font-weight:100
`

const isObject = (source) => source !== null && typeof source === 'object'

export function $log(
  val,
  title = 'log',
  color,
) {
  let bgColor
  let borderColor
  switch (typeof color) {
    case 'number':
      if (color > 0 && color <= bgColorList.length) {
        bgColor = bgColorList[color - 1];
        borderColor = borderColorList[color - 1];
      }
      break
    case 'string':
      bgColor = color;
      // TODO: dark
      borderColor = borderColorDefault;
      break
    default:
      bgColor = bgColorDefault;
      borderColor = borderColorDefault;
      break
  }

  const titleStyle = TitleStyleLog(borderColor)
  const subTitleStyle = SubTitleStyle(bgColor);

  let pattern = `%c ${title} %c%s%c %o`; // default
  let parameters = [titleStyle, subTitleStyle, ' noname ', '', val]; // default

  if (isObject(val)) {
    pattern = `%c ${title} `;
    parameters = [titleStyle];

    const entries = Object.entries(val);
    const maxLength = entries.reduce(
      (a, [k]) => (a < k.length ? k.length : a),
      -Infinity,
    );

    let first = true;
    for (const [k, v] of entries) {
      pattern += '%c%s%c%s%c%s%o%s';
      parameters.push(
        titleStyle,
        first ? '' : ` ${''.padStart(title.length, ' ')} `,
        subTitleStyle,
        ` ${k.padEnd(maxLength, ' ')} `,
        '',
        ' ',
        v,
        '\n',
      );
      first = false;
    }
    parameters.pop();
    parameters.push('');
  }

  return [pattern, ...parameters]
}
