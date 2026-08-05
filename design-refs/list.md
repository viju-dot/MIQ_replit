# List (page node 54444:117)

## Page structure (XML metadata)

<canvas id="54444:117" name="List" x="0" y="0" width="0" height="0">
  <frame id="55896:3023" name="Documentation template" x="-15219" y="12192" width="1223" height="3046">
    <instance id="55896:3024" name="_title" x="80" y="80" width="1063" height="584" />
    <frame id="55911:3539" name="Frame 1" x="80" y="727" width="1063" height="2239">
      <frame id="55911:3269" name="Frame 474" x="0" y="0" width="1063" height="388">
        <frame id="55911:3270" name="Frame 474" x="0" y="0" width="1063" height="388">
          <frame id="55911:3271" name="Frame 474" x="0" y="0" width="1063" height="388">
            <frame id="55911:3272" name="Frame 440" x="0" y="0" width="523.5" height="388">
              <frame id="55911:3273" name="Frame 439" x="48" y="48" width="427.5" height="44">
                <text id="55911:3274" name="Do:" x="0" y="0" width="53" height="44" />
              </frame>
              <frame id="55911:3275" name="Frame 439" x="48" y="124" width="427.5" height="216">
                <text id="55911:3276" name="Use to populate a List component: use as the direct semantic child (&lt;li&gt;) inside a parent List component to maintain visual alignment across stacked data points. Only use it outside the list component to display a single, uniform row of related information that is not part of any lists" x="24" y="24" width="379.5" height="168" />
              </frame>
            </frame>
            <frame id="55911:3277" name="Frame 441" x="539.5" y="0" width="523.5" height="388">
              <frame id="55911:3278" name="Frame 439" x="48" y="48" width="427.5" height="44">
                <text id="55911:3279" name="Don’t:" x="0" y="0" width="95" height="44" />
              </frame>
              <frame id="55911:3280" name="Frame 439" x="48" y="124" width="427.5" height="216">
                <text id="55911:3281" name="Don’t use outside the List component to recreate a list" x="24" y="24" width="379.5" height="48" />
              </frame>
            </frame>
          </frame>
        </frame>
      </frame>
      <frame id="55911:3304" name="Frame 968" x="0" y="420" width="1063" height="610">
        <frame id="55911:3305" name="Frame 440" x="0" y="0" width="1063" height="610">
          <frame id="55911:3306" name="Frame 439" x="48" y="48" width="967" height="44">
            <text id="55911:3307" name="Anatomy &amp; Spacing" x="0" y="0" width="323" height="44" />
          </frame>
          <text id="55911:3308" name="Anatomy &amp; Spacing To maintain visual consistency, the component follows a strict layout grid: Leading Area: Flexible width used for a variety of components like icons, avatars, checkboxes or badges. If we have checkbox, item can be selected, if not, it can’t be selected. Content Area: Contains the label and description which truncates before it hits two lines. This should be as short and concise as possible. Trailing Area: Aligned to the right for secondary actions or status indicators e.g. buttons and links. Meta Area: Any additional content that you wish to add to the list can be placed in this slot but it should be used responsibly and must remain as a list item. Note: If the description is present, the ‘leading area’ should vertically align to the top of the label rather than the centre of the container to maintain a clean baseline." x="48" y="124" width="748" height="283" />
          <frame id="55911:3309" name="Frame 953" x="48" y="439" width="748" height="123">
            <text id="55911:3310" name="Responsiveness Minimum width of 200px. Maximum width is down to the discretion of the designer. We advise to not use it full width on larger screens OR to use a double column layout if necessary. All text can never go onto two lines. It truncates. If hovered, it will show on tooltip." x="0" y="0" width="748" height="123" />
          </frame>
        </frame>
      </frame>
      <frame id="55911:3311" name="States" x="0" y="1062" width="1063" height="440">
        <frame id="55911:3312" name="Frame 440" x="0" y="0" width="1063" height="440">
          <frame id="55911:3313" name="Frame 439" x="48" y="48" width="967" height="44">
            <text id="55911:3314" name="States" x="0" y="0" width="106" height="44" />
          </frame>
          <frame id="55911:3315" name="Frame 961" x="48" y="124" width="550" height="268">
            <frame id="55911:3316" name="Frame 957" x="0" y="0" width="49" height="24" />
            <frame id="55911:3317" name="Frame 960" x="0" y="48" width="550" height="220">
              <instance id="55911:3318" name="List item" x="0" y="0" width="211" height="40">
                <frame id="0:48" name="Main" x="0" y="0" width="211" height="40">
                  <frame id="0:49" name="Inner" x="8" y="8" width="195" height="24">
                    <frame id="0:50" name="leftSlot" x="0" y="0" width="24" height="24">
                      <slot id="0:51" name="↳ leftItem" x="0" y="0" width="24" height="24">
                        <instance id="0:52" name="Checkbox" x="0" y="0" width="24" height="24" />
                      </slot>
                    </frame>
                    <frame id="0:63" name="centreSlot" x="32" y="0" width="131" height="24">
                      <frame id="0:64" name="text" x="0" y="2" width="131" height="20">
                        <text id="0:65" name="Placeholder text" x="0" y="0" width="131" height="20" />
                        <text id="0:66" name="Description" x="0" y="24" width="224" height="18" hidden="true" />
                      </frame>
                      <slot id="0:67" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                    </frame>
                    <frame id="0:68" name="trailingSlot" x="171" y="0" width="24" height="24">
                      <slot id="0:69" name="↳ rightItem" x="0" y="0" width="24" height="24" hidden="true" />
                    </frame>
                  </frame>
                </frame>
                <line id="0:70" name="Separator" x="0" y="40" width="211" height="0" />
              </instance>
              <instance id="55911:3319" name="List item" x="0" y="60" width="211" height="40">
                <frame id="0:71" name="Main" x="0" y="0" width="211" height="40">
                  <frame id="0:72" name="Inner" x="8" y="8" width="195" height="24">
                    <frame id="0:73" name="leftSlot" x="0" y="0" width="24" height="24">
                      <slot id="0:74" name="↳ leftItem" x="0" y="0" width="24" height="24">
                        <instance id="0:75" name="Checkbox" x="0" y="0" width="24" height="24" />
                      </slot>
                    </frame>
                    <frame id="0:86" name="centreSlot" x="32" y="0" width="131" height="24">
                      <frame id="0:87" name="text" x="0" y="2" width="131" height="20">
                        <text id="0:88" name="Placeholder text" x="0" y="0" width="131" height="20" />
                        <text id="0:89" name="Description" x="0" y="24" width="224" height="18" hidden="true" />
                      </frame>
                      <slot id="0:90" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                    </frame>
                    <frame id="0:91" name="trailingSlot" x="171" y="0" width="24" height="24">
                      <slot id="0:92" name="↳ rightItem" x="0" y="0" width="24" height="24" hidden="true" />
                    </frame>
                  </frame>
                </frame>
                <line id="0:93" name="Separator" x="0" y="40" width="211" height="0" />
              </instance>
              <instance id="55911:3320" name="List item" x="0" y="120" width="211" height="40">
                <frame id="0:94" name="Main" x="0" y="0" width="211" height="40">
                  <frame id="0:95" name="Inner" x="8" y="8" width="195" height="24">
                    <frame id="0:96" name="leftSlot" x="0" y="0" width="24" height="24">
                      <slot id="0:97" name="↳ leftItem" x="0" y="0" width="24" height="24">
                        <instance id="0:98" name="Checkbox" x="0" y="0" width="24" height="24" />
                      </slot>
                    </frame>
                    <frame id="0:113" name="centreSlot" x="32" y="0" width="131" height="24">
                      <frame id="0:114" name="text" x="0" y="2" width="131" height="20">
                        <text id="0:115" name="Placeholder text" x="0" y="0" width="131" height="20" />
                        <text id="0:116" name="Description" x="0" y="24" width="224" height="18" hidden="true" />
                      </frame>
                      <slot id="0:117" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                    </frame>
                    <frame id="0:118" name="trailingSlot" x="171" y="0" width="24" height="24">
                      <slot id="0:119" name="↳ rightItem" x="0" y="0" width="24" height="24" hidden="true" />
                    </frame>
                  </frame>
                </frame>
                <line id="0:120" name="Separator" x="0" y="40" width="211" height="0" />
              </instance>
              <instance id="55911:3321" name="List item" x="0" y="180" width="211" height="40">
                <frame id="0:121" name="Main" x="0" y="0" width="211" height="40">
                  <frame id="0:122" name="Inner" x="8" y="8" width="195" height="24">
                    <frame id="0:123" name="leftSlot" x="0" y="0" width="24" height="24">
                      <slot id="0:124" name="↳ leftItem" x="0" y="0" width="24" height="24">
                        <instance id="0:125" name="Checkbox" x="0" y="0" width="24" height="24" />
                      </slot>
                    </frame>
                    <frame id="0:136" name="centreSlot" x="32" y="0" width="131" height="24">
                      <frame id="0:137" name="text" x="0" y="2" width="131" height="20">
                        <text id="0:138" name="Placeholder text" x="0" y="0" width="131" height="20" />
                        <text id="0:139" name="Description" x="0" y="24" width="224" height="18" hidden="true" />
                      </frame>
                      <slot id="0:140" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                    </frame>
                    <frame id="0:141" name="trailingSlot" x="171" y="0" width="24" height="24">
                      <slot id="0:142" name="↳ rightItem" x="0" y="0" width="24" height="24" hidden="true" />
                    </frame>
                  </frame>
                </frame>
                <line id="0:143" name="Separator" x="0" y="40" width="211" height="0" />
              </instance>
              <line id="55911:3322" name="Line 26" x="211" y="21" width="41" height="0" />
              <line id="55911:3323" name="Line 27" x="211" y="81" width="41" height="0" />
              <line id="55911:3324" name="Line 28" x="211" y="141" width="41" height="0" />
              <line id="55911:3325" name="Line 29" x="211" y="201" width="41" height="0" />
              <text id="55911:3326" name="Default: The standard resting state." x="260" y="10" width="229" height="20" />
              <text id="55911:3327" name="Hover: Applies a subtle background colour." x="260" y="70" width="278" height="20" />
              <text id="55911:3328" name="Selected: Used in single/multi-selection lists." x="260" y="130" width="293" height="20" />
              <text id="55911:3329" name="Disabled: A non selectable item." x="260" y="190" width="210" height="20" />
            </frame>
          </frame>
        </frame>
      </frame>
      <frame id="55911:3330" name="Frame 969" x="0" y="1534" width="1063" height="705">
        <frame id="55911:3331" name="Frame 474" x="0" y="0" width="1063" height="705">
          <frame id="55911:3332" name="Frame 474" x="0" y="0" width="1063" height="705">
            <frame id="55911:3333" name="Frame 440" x="0" y="0" width="1063" height="705">
              <frame id="55911:3334" name="Frame 439" x="48" y="48" width="967" height="44">
                <text id="55911:3335" name="Properties" x="0" y="0" width="170" height="44" />
              </frame>
              <frame id="55911:3336" name="Frame 956" x="48" y="124" width="681" height="533">
                <rounded-rectangle id="55911:3337" name="Screenshot 2026-05-14 at 09.50.24 1" x="0" y="0" width="237" height="346" />
                <line id="55911:3338" name="Line 1" x="162" y="57" width="93" height="0" />
                <line id="55911:3339" name="Line 4" x="255" y="5" width="24" height="0" />
                <line id="55911:3340" name="Line 2" x="179" y="95" width="76" height="0.000006644131644861773" />
                <line id="55911:3341" name="Line 3" x="255" y="5" width="0" height="90" />
                <line id="55911:3342" name="Line 7" x="226" y="215" width="6" height="5.24536517332308e-7" />
                <line id="55911:3343" name="Line 12" x="232" y="205" width="34" height="0" />
                <line id="55911:3344" name="Line 23" x="254" y="104" width="25" height="0.000002185570338042453" />
                <line id="55911:3345" name="Line 14" x="256" y="306" width="23" height="0" />
                <line id="55911:3346" name="Line 24" x="265" y="205" width="14" height="0.000001049073034664616" />
                <line id="55911:3347" name="Line 9" x="162" y="244" width="94" height="0" />
                <line id="55911:3348" name="Line 10" x="232" y="214" width="4.371140676084906e-7" height="10" />
                <line id="55911:3349" name="Line 11" x="256" y="243" width="0.000002847313226084225" height="63" />
                <line id="55911:3350" name="Line 15" x="191" y="280" width="41" height="0.0000035843331716023386" />
                <line id="55911:3351" name="Line 17" x="243" y="405" width="36" height="0" />
                <line id="55911:3352" name="Line 18" x="162" y="321" width="81" height="0" />
                <line id="55911:3353" name="Line 19" x="232" y="280" width="0" height="36" />
                <line id="55911:3354" name="Line 20" x="243" y="320" width="0.0000036717574403155595" height="85" />
                <line id="55911:3355" name="Line 13" x="231" y="169" width="0" height="35" />
                <text id="55911:3356" name="leftSlot - A slot for objects placed at the start of the row." x="294" y="-6" width="382" height="20" />
                <instance id="55911:3357" name="List item" x="287" y="18" width="394" height="60">
                  <frame id="0:144" name="Main" x="0" y="0" width="394" height="60">
                    <frame id="0:145" name="Inner" x="8" y="8" width="378" height="44">
                      <frame id="0:146" name="leftSlot" x="0" y="0" width="24" height="24">
                        <slot id="0:147" name="↳ leftItem" x="0" y="0" width="24" height="24">
                          <instance id="0:148" name="Checkbox" x="0" y="0" width="24" height="24" />
                        </slot>
                      </frame>
                      <frame id="0:154" name="centreSlot" x="32" y="0" width="314" height="44">
                        <frame id="0:155" name="text" x="0" y="2" width="314" height="42">
                          <text id="0:156" name="Placeholder text" x="0" y="0" width="314" height="20" />
                          <text id="0:157" name="Description" x="0" y="24" width="314" height="18" />
                        </frame>
                        <slot id="0:158" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                      </frame>
                      <frame id="0:159" name="trailingSlot" x="354" y="0" width="24" height="24">
                        <slot id="0:160" name="↳ rightItem" x="0" y="0" width="0" height="0" />
                      </frame>
                    </frame>
                  </frame>
                  <line id="0:161" name="Separator" x="0" y="60" width="394" height="0" />
                </instance>
                <rounded-rectangle id="55911:3358" name="Rectangle 5" x="295" y="26" width="24" height="24" />
                <instance id="55911:3359" name="List item" x="287" y="218" width="394" height="60">
                  <frame id="0:162" name="Main" x="0" y="0" width="394" height="60">
                    <frame id="0:163" name="Inner" x="8" y="8" width="378" height="44">
                      <frame id="0:164" name="leftSlot" x="0" y="0" width="24" height="24">
                        <slot id="0:165" name="↳ leftItem" x="0" y="0" width="24" height="24">
                          <instance id="0:166" name="Checkbox" x="0" y="0" width="24" height="24" />
                        </slot>
                      </frame>
                      <frame id="0:172" name="centreSlot" x="32" y="0" width="314" height="44">
                        <frame id="0:173" name="text" x="0" y="2" width="314" height="42">
                          <text id="0:174" name="Placeholder text" x="0" y="0" width="314" height="20" />
                          <text id="0:175" name="Description" x="0" y="24" width="314" height="18" />
                        </frame>
                        <slot id="0:176" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                      </frame>
                      <frame id="0:177" name="trailingSlot" x="354" y="0" width="24" height="24">
                        <slot id="0:178" name="↳ rightItem" x="0" y="0" width="0" height="0" />
                      </frame>
                    </frame>
                  </frame>
                  <line id="0:179" name="Separator" x="0" y="60" width="394" height="0" />
                </instance>
                <rounded-rectangle id="55911:3360" name="Rectangle 6" x="323" y="249" width="73" height="24" />
                <rounded-rectangle id="55911:3361" name="Rectangle 9" x="323" y="126" width="114" height="24" />
                <line id="55911:3362" name="Line 6" x="162" y="169" width="70" height="0" />
                <line id="55911:3363" name="Line 21" x="255" y="132" width="0.0000012239197531016544" height="28" />
                <line id="55911:3364" name="Line 22" x="229" y="132" width="26" height="0.0000022729927877662703" />
                <text id="55911:3365" name="description - Text displayed below the heading." x="294" y="194" width="321" height="20" />
                <instance id="55911:3366" name="List item" x="287" y="118" width="394" height="60">
                  <frame id="0:180" name="Main" x="0" y="0" width="394" height="60">
                    <frame id="0:181" name="Inner" x="8" y="8" width="378" height="44">
                      <frame id="0:182" name="leftSlot" x="0" y="0" width="24" height="24">
                        <slot id="0:183" name="↳ leftItem" x="0" y="0" width="24" height="24">
                          <instance id="0:184" name="Checkbox" x="0" y="0" width="24" height="24" />
                        </slot>
                      </frame>
                      <frame id="0:190" name="centreSlot" x="32" y="0" width="314" height="44">
                        <frame id="0:191" name="text" x="0" y="2" width="314" height="42">
                          <text id="0:192" name="Placeholder text" x="0" y="0" width="314" height="20" />
                          <text id="0:193" name="Description" x="0" y="24" width="314" height="18" />
                        </frame>
                        <slot id="0:194" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                      </frame>
                      <frame id="0:195" name="trailingSlot" x="354" y="0" width="24" height="24">
                        <slot id="0:196" name="↳ rightItem" x="0" y="0" width="0" height="0" />
                      </frame>
                    </frame>
                  </frame>
                  <line id="0:197" name="Separator" x="0" y="60" width="394" height="0" />
                </instance>
                <text id="55911:3367" name="heading - Main label displayed." x="294" y="94" width="210" height="20" />
                <instance id="55911:3368" name="List item" x="287" y="318" width="394" height="60">
                  <frame id="0:198" name="Main" x="0" y="0" width="394" height="60">
                    <frame id="0:199" name="Inner" x="8" y="8" width="378" height="44">
                      <frame id="0:200" name="leftSlot" x="0" y="0" width="24" height="24">
                        <slot id="0:201" name="↳ leftItem" x="0" y="0" width="24" height="24">
                          <instance id="0:202" name="Checkbox" x="0" y="0" width="24" height="24" />
                        </slot>
                      </frame>
                      <frame id="0:208" name="centreSlot" x="32" y="0" width="314" height="44">
                        <frame id="0:209" name="text" x="0" y="2" width="314" height="42">
                          <text id="0:210" name="Placeholder text" x="0" y="0" width="314" height="20" />
                          <text id="0:211" name="Description" x="0" y="24" width="314" height="18" />
                        </frame>
                        <slot id="0:212" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                      </frame>
                      <frame id="0:213" name="trailingSlot" x="354" y="0" width="24" height="24">
                        <slot id="0:214" name="↳ rightItem" x="0" y="0" width="0" height="0" />
                      </frame>
                    </frame>
                  </frame>
                  <line id="0:215" name="Separator" x="0" y="60" width="394" height="0" />
                </instance>
                <rounded-rectangle id="55911:3369" name="Rectangle 7" x="651" y="326" width="24" height="24" />
                <text id="55911:3370" name="rightSlot - A slot for objects placed at the end of the row." x="294" y="294" width="384" height="20" />
                <instance id="55911:3371" name="List item" x="287" y="438" width="394" height="95">
                  <frame id="0:216" name="Main" x="0" y="0" width="394" height="95">
                    <frame id="0:217" name="Inner" x="8" y="8" width="378" height="79">
                      <frame id="0:218" name="leftSlot" x="0" y="0" width="24" height="24">
                        <slot id="0:219" name="↳ leftItem" x="0" y="0" width="24" height="24">
                          <instance id="0:220" name="Checkbox" x="0" y="0" width="24" height="24" />
                        </slot>
                      </frame>
                      <frame id="0:226" name="centreSlot" x="32" y="0" width="314" height="79">
                        <frame id="0:227" name="text" x="0" y="2" width="314" height="42">
                          <text id="0:228" name="Placeholder text" x="0" y="0" width="314" height="20" />
                          <text id="0:229" name="Description" x="0" y="24" width="314" height="18" />
                        </frame>
                        <slot id="0:230" name="↳ contentItem" x="0" y="52" width="314" height="27" />
                      </frame>
                      <frame id="0:231" name="trailingSlot" x="354" y="0" width="24" height="24">
                        <slot id="0:232" name="↳ rightItem" x="0" y="0" width="0" height="0" />
                      </frame>
                    </frame>
                  </frame>
                  <line id="0:233" name="Separator" x="0" y="95" width="394" height="0" />
                </instance>
                <rounded-rectangle id="55911:3372" name="Rectangle 8" x="327" y="498" width="318" height="27" />
                <text id="55911:3373" name="contentSlot - A slot for objects placed at the bottom of the list component." x="294" y="394" width="387" height="40" />
              </frame>
            </frame>
          </frame>
        </frame>
      </frame>
    </frame>
  </frame>
  <frame id="55898:2719" name="Documentation template" x="-16735" y="12192" width="1223" height="2643">
    <instance id="55898:2720" name="_title" x="80" y="80" width="1063" height="536" />
    <frame id="55898:2799" name="Slot" x="80" y="679" width="1063" height="1884">
      <frame id="55911:3823" name="Frame 474" x="0" y="0" width="1063" height="484">
        <frame id="55911:3824" name="Frame 474" x="0" y="0" width="1063" height="484">
          <frame id="55911:3825" name="Frame 474" x="0" y="0" width="1063" height="484">
            <frame id="55911:3826" name="Frame 440" x="0" y="0" width="523.5" height="484">
              <frame id="55911:3827" name="Frame 439" x="48" y="48" width="427.5" height="44">
                <text id="55911:3828" name="Do:" x="0" y="0" width="53" height="44" />
              </frame>
              <frame id="55911:3829" name="Frame 439" x="48" y="124" width="427.5" height="312">
                <text id="55911:3830" name="Linear text or data scanning: use when users need to scroll through a continuous, vertical stack of related content to find a specific entry Use for navigation menus, settings, or data feeds. Homogeneous collections: use when the data points share an identical structural skeleton but have different values For multi-selection of related item in a container placed directly on a surface component (card, page, modal)" x="24" y="24" width="379.5" height="264" />
              </frame>
            </frame>
            <frame id="55911:3831" name="Frame 441" x="539.5" y="0" width="523.5" height="484">
              <frame id="55911:3832" name="Frame 439" x="48" y="48" width="427.5" height="44">
                <text id="55911:3833" name="Don’t:" x="0" y="0" width="95" height="44" />
              </frame>
              <frame id="55911:3834" name="Frame 439" x="48" y="124" width="427.5" height="312">
                <text id="55911:3835" name="Use for complex data sets that require sorting/filtering (use a tables instead). To replace dropdown menu or multi-select dropdown menu Insert other components inside the list" x="24" y="24" width="379.5" height="120" />
              </frame>
            </frame>
          </frame>
        </frame>
      </frame>
      <frame id="55911:3667" name="Frame 969" x="0" y="516" width="1063" height="726">
        <frame id="55911:3668" name="Frame 474" x="0" y="0" width="1063" height="726">
          <frame id="55911:3669" name="Frame 474" x="0" y="0" width="1063" height="726">
            <frame id="55911:3670" name="Frame 440" x="0" y="0" width="1063" height="726">
              <frame id="55911:3671" name="Frame 439" x="48" y="48" width="967" height="44">
                <text id="55911:3672" name="Properties" x="0" y="0" width="170" height="44" />
              </frame>
              <frame id="55911:3815" name="Frame 1" x="48" y="124" width="618" height="554">
                <rounded-rectangle id="55911:3816" name="Screenshot 2026-05-29 at 14.11.30 1" x="280" y="40" width="310" height="423" />
                <text id="55911:3817" name="listWrapper - default slot property, used to insert List item component only" x="280" y="0" width="297" height="40" />
                <text id="55911:3818" name="hasScroll - to display scroll in the designs" x="321" y="534" width="297" height="20" />
                <rounded-rectangle id="55911:3819" name="Screenshot 2026-05-29 at 14.04.57 1" x="0" y="40" width="239" height="141" />
                <vector id="55911:3820" name="Line 1" x="171" y="121" width="139" height="0" />
                <vector id="55911:3821" name="Line 2" x="150" y="152" width="156.00006478730575" height="392.0000136379567" />
              </frame>
            </frame>
          </frame>
        </frame>
      </frame>
      <frame id="55911:3837" name="Frame 968" x="0" y="1274" width="1063" height="610">
        <frame id="55911:3838" name="Frame 440" x="0" y="0" width="1063" height="610">
          <frame id="55911:3839" name="Frame 439" x="48" y="48" width="967" height="44">
            <text id="55911:3840" name="Anatomy" x="0" y="0" width="150" height="44" />
          </frame>
          <text id="55911:3841" name="Anatomy &amp; Spacing The component is using a Slot wrapper that allows the designers to control the amount of elements inside the list. They can modify list a singular list item by utilising List Item properties to then populate it in the list component" x="48" y="124" width="748" height="83" />
          <frame id="55911:3842" name="Frame 953" x="48" y="239" width="748" height="123">
            <text id="55911:3843" name="Responsiveness Minimum width of 200px. Maximum width is down to the discretion of the designer. We advise to not use it full width on larger screens OR to use a double column layout if necessary. All text can never go onto two lines. It truncates. If hovered, it will show on tooltip." x="0" y="0" width="748" height="123" />
          </frame>
          <frame id="55911:3658" name="Frame 970" x="48" y="394" width="607" height="208">
            <instance id="55911:3540" name="List" x="261" y="44" width="281" height="120">
              <slot id="0:241" name="listWrapper" x="0" y="0" width="281" height="120">
                <instance id="0:242" name="List item" x="0" y="0" width="281" height="60">
                  <frame id="0:243" name="Main" x="0" y="0" width="281" height="60">
                    <frame id="0:244" name="Inner" x="8" y="8" width="265" height="44">
                      <frame id="0:245" name="leftSlot" x="0" y="0" width="40" height="40">
                        <slot id="0:246" name="↳ leftItem" x="0" y="0" width="40" height="40">
                          <instance id="0:247" name="Avatar" x="0" y="0" width="40" height="40" />
                        </slot>
                      </frame>
                      <frame id="0:257" name="centreSlot" x="48" y="0" width="185" height="44">
                        <frame id="0:258" name="text" x="0" y="2" width="185" height="42">
                          <text id="0:259" name="Placeholder text" x="0" y="0" width="185" height="20" />
                          <text id="0:260" name="Description" x="0" y="24" width="185" height="18" />
                        </frame>
                        <slot id="0:261" name="↳ contentItem" x="0" y="30" width="224" height="27" hidden="true" />
                      </frame>
                      <frame id="0:262" name="trailingSlot" x="241" y="0" width="24" height="24">
                        <slot id="0:263" name="↳ rightItem" x="0" y="0" width="24" height="24" hidden="true" />
                      </frame>
                    </frame>
                  </frame>
                  <line id="0:264" name="Separator" x="0" y="60" width="281" height="0" />
                </instance>
                <instance id="0:265" name="List item" x="0" y="60" width="281" height="60">
                  <frame id="0:266" name="Main" x="0" y="0" width="281" height="60">
                    <frame id="0:267" name="Inner" x="8" y="8" width="265" height="44">
                      <frame id="0:268" name="leftSlot" x="0" y="0" width="40" height="40">
                        <slot id="0:269" name="↳ leftItem" x="0" y="0" width="40" height="40">
                          <instance id="0:270" name="Avatar" x="0" y="0" width="40" height="40" />
                        </slot>
                      </frame>
                      <frame id="0:277" name="centreSlot" x="48" y="0" width="185" height="44">
                        <frame id="0:278" name="text" x="0" y="2" width="185" height="42">
                          <text id="0:279" name="Placeholder text" x="0" y="0" width="185" height="20" />
                          <text id="0:280" name="Description" x="0" y="24" width="185" height="18" />
                        </fram
...[truncated; the scanned bounded output (including any structured content) is saved to /tmp/mcp_output/mcpFigma_getMetadata_1785937228441_820d584b.txt in the repl this call ran in — read it with ReadFile from the same connection state]


## frame "Documentation template" (55896:3023, 1223x3046)

An unexpected error occurred.
Figma Debug UUID: 9d04ec56-ca39-4934-b82e-bb706647f36f

## frame "Documentation template" (55898:2719, 1223x2643)

const imgAvatarImage = "https://www.figma.com/api/mcp/asset/dde8e45a-88ed-4af4-ad48-a14069695056.png";
const imgVectorFrame = "https://www.figma.com/api/mcp/asset/28724e4a-f7cb-4e07-b573-37fda973cc48.svg";
const imgSeparator = "https://www.figma.com/api/mcp/asset/720b25fc-d522-4d5c-88fc-f4595e5a2366.svg";
const imgImage1 = "https://www.figma.com/api/mcp/asset/bf405693-dc8d-44f4-85b2-24a739d4e951.png";
const imgScreenshot20260529At1411301 = "https://www.figma.com/api/mcp/asset/1b78009e-0d77-4d1b-b156-669e900dc1ea.png";
const imgScreenshot20260529At1404571 = "https://www.figma.com/api/mcp/asset/eda9bc52-b670-4bf8-accc-2bdd6fd0319f.png";
const imgScreenshot20260529At1436091 = "https://www.figma.com/api/mcp/asset/30be6c1d-7af8-47d8-abcb-ae22755c3c02.png";
const imgLine1 = "https://www.figma.com/api/mcp/asset/4d501eb4-9e13-47ff-a520-caf0a5e33955.svg";
const imgLine2 = "https://www.figma.com/api/mcp/asset/3e598dc4-fc7a-4c5a-bc71-1cd2ea73fe59.svg";
const imgLine3 = "https://www.figma.com/api/mcp/asset/727778aa-35ec-4a61-b267-4631fb60f1c5.svg";

type BadgeRoundedProps = {
  className?: string;
  size?: "Compact";
  style?: "Filled";
  type?: "Brand (Bold)" | "pro";
};

function BadgeRounded({ className, size = "Compact", style = "Filled", type = "Brand (Bold)" }: BadgeRoundedProps) {
  const isProAndCompactAndFilled = type === "pro" && size === "Compact" && style === "Filled";
  return (
    <div className={className || `content-stretch flex items-start relative ${isProAndCompactAndFilled ? "" : String.raw`gap-[var(--odd_numbers\/10,10px)] h-[var(--\[old\]sizing\/18,18px)]`}`} id={isProAndCompactAndFilled ? "node-41496_1377" : "node-34051_125"}>
      {type === "Brand (Bold)" && size === "Compact" && style === "Filled" && (
        <div className="bg-[var(--container/static/brand/bold/background,#7c33b5)] content-stretch flex gap-[var(--numbers\/4,4px)] h-[18px] items-center justify-center px-[var(--numbers\/8,8px)] py-[var(--numbers\/2,2px)] relative rounded-[var(--\[old\]radiuses\/round,100px)] shrink-0" data-node-id="34051:126">
          <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/static/brand/bold/foreground,white)] text-center whitespace-nowrap" data-node-id="34051:127">
            Label title
          </p>
        </div>
      )}
      {isProAndCompactAndFilled && (
        <div className="content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[18px] items-start relative shrink-0" data-node-id="41496:1370" data-name="Badge/rounded">
          <div className="bg-gradient-to-r content-stretch flex from-[50.481%] from-[var(--gradients\/pink\/1,#d71a82)] gap-[var(--numbers\/4,4px)] h-[18px] items-center justify-center px-[var(--numbers\/8,8px)] py-[var(--numbers\/2,2px)] relative rounded-[var(--\[old\]radiuses\/round,100px)] shrink-0 to-[var(--gradients\/pink\/2,#f456ca)]" data-node-id="I41496:1370;34051:126">
            <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/static/brand/bold/foreground,white)] text-center whitespace-nowrap" data-node-id="I41496:1370;34051:127">
              Pro
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type AvatarProps = {
  className?: string;
  plan?: "Pro";
  size?: "40";
  state?: "Picture";
};

function Avatar({ className, plan = "Pro", size = "40", state = "Picture" }: AvatarProps) {
  return (
    <div className={className || "content-stretch flex items-center overflow-clip px-[2px] relative"} data-node-id="37983:13361">
      <div className="h-[40px] relative shrink-0 w-[36px]" data-node-id="37996:14358" data-name="Avatar">
        <div className="absolute left-[2px] rounded-[24px] size-[32px] top-0" data-node-id="37983:13357" data-name="Avatar Image">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgAvatarImage} />
        </div>
        <BadgeRounded className="-translate-x-1/2 absolute bottom-0 content-stretch flex items-start left-1/2" type="pro" />
      </div>
    </div>
  );
}

type ListItemProps = {
  className?: string;
  contentItem?: React.ReactNode | null;
  contentSlot?: boolean;
  description?: boolean;
  descriptionValue?: string;
  hasSeparator?: boolean;
  headingValue?: string;
  leftItem?: React.ReactNode | null;
  leftSlot?: boolean;
  rightItem?: React.ReactNode | null;
  rightSlot?: boolean;
  state?: "Default";
};

function ListItem({ className, contentItem = null, contentSlot = false, description = false, descriptionValue = "Description", hasSeparator = true, headingValue = "Placeholder text", leftItem = null, leftSlot = true, rightItem = null, rightSlot = false, state = "Default" }: ListItemProps) {
  return (
    <div className={className || "content-stretch flex flex-col items-start min-w-[200px] relative w-[304px]"} data-node-id="55117:76318">
      <div className="content-stretch flex flex-col gap-[var(--spacing\/100,8px)] items-start justify-center p-[var(--spacing\/100,8px)] relative shrink-0 w-full" data-node-id="55117:76319" data-name="Main">
        <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-start relative shrink-0 w-full" data-node-id="55117:76320" data-name="Inner">
          {leftSlot && (
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" data-node-id="55117:76321" data-name="leftSlot">
              {leftSlot && (
                <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-node-id="55117:76322" data-name="↳ leftItem">
                  {leftItem || (
                    <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center p-[var(--numbers\/none,0px)] relative shrink-0" data-node-id="55117:76323" data-name="Checkbox">
                      <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I55117:76323;43278:11875" data-name="Checkbox-Element">
                        <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I55117:76323;43278:11875;43183:10139" data-name="inner_container">
                          <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I55117:76323;43278:11875;43183:10140" data-name="container" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--spacing\/100,8px)] items-start min-w-px pt-[var(--spacing\/25,2px)] relative self-stretch" data-node-id="55117:76324" data-name="centreSlot">
            <div className="[word-break:break-word] content-stretch flex flex-col font-['DM_Sans:Regular'] gap-[var(--spacing\/50,4px)] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="55117:76451" data-name="text">
              <p className="leading-[20px] overflow-hidden relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)] text-ellipsis w-full" data-node-id="55117:76325">
                {headingValue}
              </p>
              {description && (
                <p className="h-[18px] leading-[18px] overflow-hidden relative shrink-0 text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis w-full" data-node-id="55117:76326">
                  {descriptionValue}
                </p>
              )}
            </div>
            {contentSlot && (
              <div className="h-[27px] relative shrink-0 w-full" data-node-id="55117:76330" data-name="↳ contentItem">
                {contentItem}
              </div>
            )}
          </div>
          <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center justify-end relative shrink-0" data-node-id="55117:76327" data-name="trailingSlot">
            {rightSlot && (
              <div className="content-stretch flex gap-[var(--spacing\/100,8px)] h-[24px] items-center justify-end overflow-clip p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="55117:76328" data-name="↳ rightItem">
                {rightItem || (
                  <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="55117:76329" data-name="Button">
                    <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I55117:76329;46186:2614" data-name="button-medium">
                      <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I55117:76329;46186:2615" data-name="Style=Regular,Size=20,State=Default">
                        <div className="relative shrink-0 size-[16.25px]" data-node-id="I55117:76329;46186:2615;28561:10472" data-name="Vector frame">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {hasSeparator && (
        <div className="h-0 relative shrink-0 w-full" data-node-id="55117:76331" data-name="Separator">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgSeparator} />
          </div>
        </div>
      )}
    </div>
  );
}

type ListProps = {
  className?: string;
  children?: React.ReactNode | null;
  hasScroll?: boolean;
};

function List({ className, children = null, hasScroll = true }: ListProps) {
  return (
    <div className={className || "content-stretch flex items-start min-w-[200px] relative w-[281px]"} data-node-id="55744:1345" data-name="List">
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="55744:1398" data-name="listWrapper">
        {children || (
          <>
            <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" />
            <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" />
            <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" />
            <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" />
            <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" />
            <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" />
          </>
        )}
      </div>
      {hasScroll && (
        <div className="flex items-center justify-center relative self-stretch shrink-0 w-[12px]" data-node-id="55779:1860" style={{ containerType: "size" }}>
          <div className="flex-none rotate-90 w-[100cqh]">
            <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] h-[12px] items-start justify-center px-[var(--spacing\/50,4px)] py-[var(--spacing\/25,2px)] relative w-full" data-name="Scrollbar">
              <div className="flex h-[8px] items-center justify-center relative shrink-0 w-[120px]" data-node-id="I55779:1860;51075:50829">
                <div className="-rotate-90 flex-none">
                  <div className="bg-[var(--surface/background/lvl4,#e1e1e8)] h-[120px] relative rounded-[100px] w-[8px]" data-name="Bar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentationTemplate() {
  return (
    <div className="bg-[var(--surface/background/lvl2,#f7f7fa)] border-[#ffca01] border-solid border-t-8 content-stretch flex flex-col gap-[63px] items-start p-[80px] relative size-full" data-node-id="55898:2719" data-name="Documentation template">
      <div className="content-stretch flex flex-col gap-[var(--spacing\/800,64px)] items-start relative shrink-0 w-full" data-node-id="55898:2720" data-name="_title">
        <div className="content-stretch flex flex-col gap-[32px] items-start pb-[var(--spacing\/400,32px)] relative shrink-0 w-[611.356px]" data-node-id="I55898:2720;44136:259" data-name="watermark">
          <div className="h-[4px] relative shrink-0 w-[89.04px]" data-node-id="I55898:2720;44136:257" data-name="image 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
          </div>
          <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[normal] min-w-full not-italic relative shrink-0 text-[28px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] tracking-[5.6px] uppercase w-[min-content]" data-node-id="I55898:2720;44136:256">
            Fiber Design System
          </p>
        </div>
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[var(--spacing\/500,40px)] items-start leading-[0] not-italic relative shrink-0 w-full" data-node-id="I55898:2720;44136:260" data-name="text">
          <div className="flex flex-col font-['DM_Sans:SemiBold'] justify-center relative shrink-0 text-[80px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-2px] w-full" data-node-id="I55898:2720;44136:254">
            <p className="leading-[120px]">List documentation</p>
          </div>
          <p className="font-['DM_Sans:Regular'] relative shrink-0 text-[0px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] tracking-[-1px] w-full" data-node-id="I55898:2720;44136:255">
            <span className="leading-[48px] text-[40px]">The List component is a structural layout component that groups, organizes, and manages a continuous, vertically stacked collection of related content items -</span>
            <span className="leading-[48px] text-[#7c33b5] text-[40px]">{` `}</span>
            <a className="[text-underline-position:from-font] cursor-pointer decoration-from-font decoration-solid leading-[48px] text-[#7c33b5] text-[40px] underline" href="List item component" target="_self">
              <span className="[text-underline-position:from-font] decoration-from-font decoration-solid underline" href="List item component" target="_self">
                list items
              </span>
            </a>
            <span className="leading-[48px] text-[#7c33b5] text-[40px]">.</span>
          </p>
        </div>
        <div className="h-0 relative shrink-0 w-full" data-node-id="I55898:2720;44136:258">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine1} />
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[var(--spacing\/400,32px)] items-start overflow-clip relative shrink-0 w-full" data-node-id="55898:2799" data-name="Slot">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1063px]" data-node-id="55911:3823">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="55911:3824">
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="55911:3825">
              <div className="bg-[var(--container/static/success/subtle/background,#e7faef)] content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-w-px p-[48px] relative rounded-[45px]" data-node-id="55911:3826">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="55911:3827">
                  <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[44px] not-italic relative shrink-0 text-[36px] text-[color:var(--container/static/success/subtle/foreground/variation,#115639)] tracking-[-0.72px] whitespace-nowrap" data-node-id="55911:3828">
                    Do:
                  </p>
                </div>
                <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex items-start overflow-clip p-[var(--spacing\/300,24px)] relative rounded-[28px] shrink-0 w-full" data-node-id="55911:3829">
                  <ul className="[word-break:break-word] block flex-[1_0_0] font-['DM_Sans:Regular'] leading-[0] list-disc min-w-px not-italic relative text-[0px] text-black" data-node-id="55911:3830">
                    <li className="leading-[24px] mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)] text-[16px]">
                      <span className="[word-break:break-word] font-['DM_Sans:SemiBold'] not-italic">Linear text or data scanning</span>: use when users need to scroll through a continuous, vertical stack of related content to find a specific entry
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[24px] text-[16px]">Use for navigation menus, settings, or data feeds.</span>
                    </li>
                    <li className="leading-[24px] mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)] text-[16px]">
                      <span className="[word-break:break-word] font-['DM_Sans:SemiBold'] not-italic">Homogeneous collections:</span>
                      {` use when the data points share an identical structural skeleton but have different values`}
                    </li>
                    <li className="leading-[24px] ms-[calc(var(--list-marker-font-size,0)*1.5*1)] text-[16px]">
                      {`For `}
                      <span className="[word-break:break-word] font-['DM_Sans:SemiBold'] not-italic">multi-selection</span>
                      {` of related item in a container `}
                      <span className="[word-break:break-word] font-['DM_Sans:SemiBold'] not-italic">{`placed directly on a surface `}</span>component (card, page, modal)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-[var(--container/static/error/sutble/background,#ffebf1)] content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-w-px p-[48px] relative rounded-[45px] self-stretch" data-node-id="55911:3831">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="55911:3832">
                  <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[44px] not-italic relative shrink-0 text-[36px] text-[color:var(--container/static/error/sutble/foreground/variation,#ad102c)] tracking-[-0.72px] whitespace-nowrap" data-node-id="55911:3833">
                    Don’t:
                  </p>
                </div>
                <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex flex-[1_0_0] items-start min-h-px overflow-clip p-[var(--spacing\/300,24px)] relative rounded-[28px] w-full" data-node-id="55911:3834">
                  <ul className="[word-break:break-word] block flex-[1_0_0] font-['DM_Sans:Regular'] leading-[0] list-disc min-w-px not-italic relative text-[0px] text-black" data-node-id="55911:3835">
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[24px] text-[16px]">Use for complex data sets that require sorting/filtering (use a tables instead).</span>
                    </li>
                    <li className="leading-[24px] mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)] text-[16px]">
                      {`To replace `}
                      <span className="[word-break:break-word] font-['DM_Sans:SemiBold'] not-italic">dropdown menu</span>
                      {` or `}
                      <span className="[word-break:break-word] font-['DM_Sans:SemiBold'] not-italic">multi-select dropdown menu</span>
                    </li>
                    <li className="ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[24px] not-italic text-[16px]">Insert other components inside the list</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1063px]" data-node-id="55911:3667">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="55911:3668">
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="55911:3669">
              <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-w-px p-[48px] relative rounded-[45px]" data-node-id="55911:3670">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="55911:3671">
                  <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[44px] not-italic relative shrink-0 text-[36px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.72px] whitespace-nowrap" data-node-id="55911:3672">
                    Properties
                  </p>
                </div>
                <div className="h-[554px] overflow-clip relative shrink-0 w-[618px]" data-node-id="55911:3815">
                  <div className="absolute h-[423px] left-[280px] top-[40px] w-[310px]" data-node-id="55911:3816" data-name="Screenshot 2026-05-29 at 14.11.30 1">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img alt="" className="absolute h-[103.55%] left-0 max-w-none top-[-3.55%] w-full" src={imgScreenshot20260529At1411301} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] absolute font-['DM_Sans:SemiBold'] leading-[0] left-[280px] not-italic text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] top-0 w-[297px]" data-node-id="55911:3817">
                    <span className="leading-[20px]">{`listWrapper - default slot property, used to insert `}</span>
                    <span className="leading-[20px] text-[#da294b]">List item component only</span>
                  </p>
                  <p className="[word-break:break-word] absolute font-['DM_Sans:SemiBold'] leading-[20px] left-[321px] not-italic text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] top-[534px] w-[297px]" data-node-id="55911:3818">
                    hasScroll - to display scroll in the designs
                  </p>
                  <div className="absolute border border-[var(--border/static/subtle/neutral,#e1e1e8)] border-solid h-[141px] left-0 top-[40px] w-[239px]" data-node-id="55911:3819" data-name="Screenshot 2026-05-29 at 14.04.57 1">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260529At1404571} />
                  </div>
                  <div className="absolute h-0 left-[171px] top-[121px] w-[139px]" data-node-id="55911:3820">
                    <div className="absolute inset-[-5.33px_-3.84%_-5.33px_-0.72%]">
                      <img alt="" className="block max-w-none size-full" src={imgLine2} />
                    </div>
                  </div>
                  <div className="absolute h-[392px] left-[150px] top-[152px] w-[156px]" data-node-id="55911:3821">
                    <div className="absolute inset-[-0.26%_-3.42%_-1.36%_-0.64%]">
                      <img alt="" className="block max-w-none size-full" src={imgLine3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col h-[610px] items-start relative shrink-0 w-[1063px]" data-node-id="55911:3837">
          <div className="bg-[var(--surface/background/lvl2,#f7f7fa)] content-stretch flex flex-[1_0_0] flex-col gap-[32px] items-start min-h-px p-[48px] relative rounded-[45px] w-full" data-node-id="55911:3838">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="55911:3839">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[44px] not-italic relative shrink-0 text-[36px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.72px] whitespace-nowrap" data-node-id="55911:3840">
                Anatomy
              </p>
            </div>
            <div className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[0] not-italic relative shrink-0 text-[0px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] w-[748px] whitespace-pre-wrap" data-node-id="55911:3841">
              <p className="font-['DM_Sans:Medium'] leading-[24px] mb-0 text-[16px]">{`Anatomy & Spacing`}</p>
              <p className="leading-[20px] mb-0 text-[14px]">​</p>
              <p className="leading-[20px] text-[14px]">The component is using a Slot wrapper that allows the designers to control the amount of elements inside the list. They can modify list a singular list item by utilising List Item properties to then populate it in the list component</p>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="55911:3842">
              <div className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[0] not-italic relative shrink-0 text-[0px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] w-[748px]" data-node-id="55911:3843">
                <p className="font-['DM_Sans:Medium'] leading-[24px] mb-0 text-[16px] whitespace-pre-wrap">Responsiveness</p>
                <p className="leading-[20px] mb-0 text-[14px] whitespace-pre-wrap">​</p>
                <ul className="list-disc">
                  <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                    <span className="leading-[20px] text-[14px]">Minimum width of 200px.</span>
                  </li>
                  <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                    <span className="leading-[20px] text-[14px]">{`Maximum width is down to the discretion of the designer. We advise to not use it full width on larger screens OR to use a double column layout if necessary. `}</span>
                  </li>
                  <li className="ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                    <span className="leading-[20px] text-[14px]">All text can never go onto two lines. It truncates. If hovered, it will show on tooltip.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white h-[208px] overflow-clip relative rounded-[20px] shrink-0 w-[607px]" data-node-id="55911:3658">
              <List className="absolute content-stretch flex items-start left-[261px] min-w-[200px] top-[44px] w-[281px]" hasScroll={false}>
                <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" description descriptionValue="Agency director" headingValue="Sammy Tailor" leftItem={<Avatar className="content-stretch flex items-center overflow-clip px-[2px] relative shrink-0" />} />
                <ListItem className="content-stretch flex flex-col items-start relative shrink-0 w-full" description descriptionValue="Agency director" headingValue="Sammy Tailor" leftItem={<Avatar className="content-stretch flex items-center overflow-clip px-[2px] relative shrink-0" />} />
              </List>
              <div className="absolute border border-[var(--border/static/subtle/neutral,#e1e1e8)] border-solid h-[120px] left-[35px] top-[44px] w-[210px]" data-node-id="55911:9904" data-name="Screenshot 2026-05-29 at 14.36.09 1">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260529At1436091} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
These styles are contained in the design: Display Sm/Regular: Font(family: "DM Sans", style: Regular, size: 40, weight: 400, lineHeight: 48, letterSpacing: -2.5), Display Sm/Headline 2xl/Medium: Font(family: "DM Sans", style: Medium, size: 36, weight: 500, lineHeight: 44, letterSpacing: -2), Body Lg/Regular: Font(family: "DM Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0), Body Md/Semibold: Font(family: "DM Sans", style: SemiBold, size: 14, weight: 600, lineHeight: 20, letterSpacing: 0), Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), Avatar/Female/Rhea Hull: , Body Sm/Medium: Font(family: "DM Sans", style: Medium, size: 12, weight: 500, lineHeight: 18, letterSpacing: 0), pink: , Body Sm/Regular: Font(family: "DM Sans", style: Regular, size: 12, weight: 400, lineHeight: 18, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
