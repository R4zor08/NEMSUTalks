# import packages
import streamlit as st
import pandas as pd
import os
import plotly.express as px
import openai
from dotenv import load_dotenv
from textblob import TextBlob


# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = openai.OpenAI()


# Helper function to get dataset path
def get_dataset_path():
    # Get the current script directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the path to the CSV file
    excel_path = os.path.join(current_dir, "data", "Datasetprojpowerbi.csv")
    return excel_path


# Function to get sentiment using TextBlob (fallback when API is unavailable)
@st.cache_data
def get_sentiment_textblob(text):
    if not text or pd.isna(text):
        return "Neutral"
    try:
        blob = TextBlob(str(text))
        polarity = blob.sentiment.polarity
        
        if polarity > 0.1:
            return "Positive"
        elif polarity < -0.1:
            return "Negative"
        else:
            return "Neutral"
    except Exception as e:
        st.warning(f"TextBlob error: {e}")
        return "Neutral"

# Function to get sentiment using GenAI with fallback
@st.cache_data
def get_sentiment(text):
    if not text or pd.isna(text):
        return "Neutral"
    
    # If OpenAI previously failed, skip calling it for the rest of the session
    if st.session_state.get("openai_unavailable", False):
        return get_sentiment_textblob(text)

    # Helper to normalize model output to allowed labels
    def _normalize_label(raw: str) -> str:
        if not isinstance(raw, str):
            return "Neutral"
        label = raw.strip().lower().replace(".", "").replace("\n", " ")
        mapping = {
            "pos": "Positive", "positive": "Positive", 
            "neg": "Negative", "negative": "Negative",
            "neu": "Neutral", "neutral": "Neutral"
        }
        return mapping.get(label, mapping.get(label.split(" ")[0], "Neutral"))

    # Try OpenAI API first with stricter prompt and examples
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": (
                    "You are a precise sentiment classifier. "
                    "Return exactly one of: Positive, Negative, Neutral. No punctuation or extras."
                )},
                {"role": "user", "content": "I love the new library hours, thanks!"},
                {"role": "assistant", "content": "Positive"},
                {"role": "user", "content": "The hostel wifi is terrible and never works."},
                {"role": "assistant", "content": "Negative"},
                {"role": "user", "content": "The exam schedule was released."},
                {"role": "assistant", "content": "Neutral"},
                {"role": "user", "content": f"Classify: {text}"}
            ],
            temperature=0,
            max_tokens=100
        )
        raw = response.choices[0].message.content.strip()
        norm = _normalize_label(raw)
        if norm in ("Positive", "Negative", "Neutral"):
            return norm
        # Fallback to TextBlob normalization if unexpected output
        return get_sentiment_textblob(text)
    except Exception as e:
        # Mark OpenAI as unavailable for the rest of the session; silently fallback
        if not st.session_state.get("openai_unavailable", False):
            st.session_state["openai_unavailable"] = True
        return get_sentiment_textblob(text)

st.set_page_config(page_title="Student Sentiment", page_icon="🔍", layout="wide")

# Prepare analysis method options early for sidebar usage
analysis_options = ["AI (OpenAI GPT) - More accurate", "TextBlob - Free, no API required"]
default_index = 1
if st.session_state.get("openai_unavailable", False):
    default_index = 1

# Subtle custom styling
with st.sidebar:
    st.write("")
    # Fixed theme (dark mode)
    theme_choice = True
    st.subheader("Analysis")
    analysis_method = st.radio(
        "Choose method",
        analysis_options,
        index=default_index,
        help="AI method requires OpenAI API key; TextBlob is free."
    )

primary_bg = "#0b1220"
card_bg_grad = "linear-gradient(135deg, rgba(31,41,55,0.85) 0%, rgba(17,24,39,0.85) 100%)"
text_color = "#e5e7eb"
border_color = "rgba(255,255,255,0.1)"
shadow = "0 10px 30px rgba(0,0,0,0.25)"
input_bg = "#0f172a"
link_color = "#93c5fd"
button_bg = "#2563eb"
button_bg_hover = "#1d4ed8"
button_text = "#ffffff"

# Ensure Plotly charts match the theme for readability
px.defaults.template = "plotly_dark"

st.markdown(
    f"""
    <style>
    html, body, .stApp {{ background: {primary_bg}; color: {text_color}; }}
    .main > div {{ padding-top: 0.25rem; }}
    .metric-card {{
        backdrop-filter: blur(8px);
        background: {card_bg_grad};
        color: {text_color};
        border-radius: 14px;
        padding: 16px 18px;
        border: 1px solid {border_color};
        box-shadow: {shadow};
    }}
    .metric-label {{ font-size: 0.9rem; opacity: 0.85; }}
    .metric-value {{ font-size: 1.9rem; font-weight: 800; margin-top: 2px; }}
    .stApp header {{ background: transparent; }}
    .block-header {{ font-weight: 700; letter-spacing: .2px; margin: 6px 0 2px; }}
    /* High-contrast text across common elements */
    h1, h2, h3, h4, h5, h6, p, span, label, .stMarkdown, .stText, .stCaption, .stRadio, .stSelectbox, .stMultiSelect {{ color: {text_color} !important; }}
    a {{ color: {link_color}; }}
    /* Inputs */
    input, textarea, select {{
        background-color: {input_bg} !important;
        color: {text_color} !important;
        border: 1px solid {border_color} !important;
    }}
    .stTextInput input, .stTextArea textarea, .stDateInput input {{
        background-color: {input_bg} !important;
        color: {text_color} !important;
        border: 1px solid {border_color} !important;
    }}
    .stDownloadButton > button, .stButton > button {{
        color: {button_text} !important;
        border: 1px solid transparent !important;
        background: {button_bg} !important;
        font-weight: 600;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }}
    .stDownloadButton > button:hover, .stButton > button:hover {{
        background: {button_bg_hover} !important;
        filter: brightness(1.02);
    }}
    .stDownloadButton > button:focus, .stButton > button:focus {{
        outline: 2px solid {link_color} !important;
        outline-offset: 2px;
    }}
    /* Tabs labels contrast */
    .stTabs [role="tab"] p {{ color: {text_color} !important; font-weight: 600; }}
    .stTabs [role="tab"][aria-selected="true"] p {{ color: {link_color} !important; }}
    /* Dataframe text visibility */
    .stDataFrame div, .stDataFrame table, .stDataFrame th, .stDataFrame td {{ color: {text_color} !important; }}
    </style>
    """,
    unsafe_allow_html=True,
)

# Extra light mode refinements for maximum readability and a cooler look
if not theme_choice:
    st.markdown(
        """
        <style>
        /* Headings and body text stronger contrast */
        h1, h2, h3, h4, h5, h6 { color: #0f172a !important; font-weight: 800; }
        p, span, label { color: #111827 !important; }
        [data-testid="stSidebar"] * { color: #111827 !important; }

        /* Dataframe readability */
        .stDataFrame thead th { background-color: #eef2f7 !important; color: #111827 !important; }
        .stDataFrame tbody tr:nth-child(even) { background: #fafbff !important; }
        .stDataFrame tbody tr:hover { background: #eef6ff !important; }

        /* Tabs styling for clear active state */
        .stTabs [role="tab"] { background: rgba(0,0,0,0.03); border-radius: 8px; }
        .stTabs [role="tab"][aria-selected="true"] { background: #e8f0fe; }

        /* Inputs borders a tad darker for clarity */
        input, textarea, select { border-color: rgba(15,23,42,0.15) !important; }
        .stTextInput input, .stTextArea textarea, .stDateInput input { border-color: rgba(15,23,42,0.15) !important; }

        /* Alerts/messages text readable */
        [data-testid="stAlert"] * { color: #111827 !important; }
        </style>
        """,
        unsafe_allow_html=True,
    )

st.title("🔍 Student Sentiment Analysis")
st.caption("AI-powered insights into student sentiments with dynamic filtering and charts.")
st.divider()

# Analysis method moved to sidebar for a cleaner layout

# Sidebar controls
with st.sidebar:
    st.header("Controls")
    if st.button("📥 Load Dataset"):
        try:
            excel_path = get_dataset_path()
            try:
                df = pd.read_csv(excel_path)
            except Exception:
                df = pd.read_excel(excel_path)
            # Normalize categories to exactly three buckets
            # We'll defer final 3-bucket mapping until after renaming so we can use
            # standardized column names and keyword-based classification.
            # Standardize column names to exact schema
            rename_candidates = {
                "student_ID": "Student_ID",
                "Student_id": "Student_ID",
                "student_id": "Student_ID",
                "raw_sentiment_text": "Raw_Sentiments",
                "Raw_sentiment_text": "Raw_Sentiments",
                "Raw_Sentiment": "Raw_Sentiments",
                "category": "Category",
                "Category": "Category",
                "resolved": "Resolved",
                "Resolved": "Resolved",
            }
            df = df.rename(columns={k: v for k, v in rename_candidates.items() if k in df.columns})
            # Final 3-bucket mapping using both original category (now in Category)
            # and keywords found in Raw_Sentiments.
            def _classify_category(raw_text: str, original_cat: str) -> str:
                t = str(raw_text).lower() if pd.notna(raw_text) else ""
                c = str(original_cat).strip() if pd.notna(original_cat) else ""

                # Direct original category hints
                if c.lower() in ["faculty", "subject"]:
                    return "Instruction"
                if c.lower() in ["facilities", "it services"]:
                    return "Physical Facilities & Equipment"
                if c.lower() in ["academic support", "registrar", "administration"]:
                    return "Administration"

                # Keyword rules
                admin_kw = [
                    "registrar", "guard", "security", "admin", "administration",
                    "grade percentage", "grading percentage", "not enough rooms",
                    "insufficient rooms", "room shortage"
                ]
                instr_kw = [
                    "faculty", "professor", "teacher", "instructor", "subject",
                    "late grade", "late grades", "grade delay", "doesn't attend",
                    "does not attend", "not attending class", "missed classes"
                ]
                facilities_kw = [
                    "canteen", "classroom", "classrooms", "comfort room", "comfort rooms",
                    "restroom", "restrooms", "toilet", "computers", "computer",
                    "white board", "whiteboard", "equipment", "laboratory", "lab"
                ]

                if any(k in t for k in admin_kw):
                    return "Administration"
                if any(k in t for k in instr_kw):
                    return "Instruction"
                if any(k in t for k in facilities_kw):
                    return "Physical Facilities & Equipment"

                # Fallbacks if no keyword matched
                if c:
                    # Map any lingering originals conservatively
                    if c.lower() in ["it services", "facilities"]:
                        return "Physical Facilities & Equipment"
                    if c.lower() in ["faculty", "subject", "department"]:
                        return "Instruction"
                    if c.lower() in ["academic support", "registrar", "administration"]:
                        return "Administration"
                # Default to Administration per user's guidance for administrative concerns
                return "Administration"

            if "Category" in df.columns and "Raw_Sentiments" in df.columns:
                df["Category"] = [
                    _classify_category(txt, cat) for txt, cat in zip(df["Raw_Sentiments"], df["Category"])
                ]
            st.session_state["df"] = df
            st.success("Student sentiments dataset loaded successfully!")
        except FileNotFoundError:
            st.error("Dataset not found. Please check the file path.")
        except Exception as e:
            st.error(f"Error loading dataset: {e}")

    if st.button("🔍 Analyze Sentiment"):
        if "df" in st.session_state:
            try:
                with st.spinner("Analyzing sentiment (this may take a moment)..."):
                    # Choose function based on sidebar selection and availability
                    if analysis_method.startswith("AI") and not st.session_state.get("openai_unavailable", False):
                        sentiment_func = get_sentiment
                    else:
                        sentiment_func = get_sentiment_textblob

                    # Analyze the entire dataset with a progress bar
                    df_work = st.session_state["df"].copy()
                    text_series = df_work.get("Raw_Sentiments")
                    if text_series is None:
                        st.error("Column 'Raw_Sentiments' not found.")
                    else:
                        progress = st.progress(0)
                        sentiments = []
                        total = len(text_series)
                        for idx, txt in enumerate(text_series):
                            sentiments.append(sentiment_func(txt))
                            if (idx + 1) % max(1, total // 100) == 0:
                                progress.progress(min(1.0, (idx + 1) / total))
                        df_work["Sentiment"] = sentiments
                        st.session_state["df"] = df_work
                        progress.progress(1.0)
                        st.success("Sentiment analysis completed for all rows!")
            except Exception as e:
                st.error(f"Something went wrong: {e}")
        else:
            st.warning("Please ingest the dataset first.")

# Display the dataset if it exists
if "df" in st.session_state:
    df_all = st.session_state["df"]
    has_category = "Category" in df_all.columns

    # Sidebar filters
    with st.sidebar:
        st.divider()
        st.subheader("Filters")

        # Category filter (preserved) 
        category_options = ["All"]
        if has_category:
            category_options += sorted(list(df_all["Category"].dropna().unique()))
        selected_category = st.selectbox("Category", category_options)

        # Status filter: All, Resolved (date present in Resolved), On Process (string equals 'On Process')
        status_options = ["All", "Resolved", "On Process"]
        selected_status = st.selectbox("Status", status_options)

        # Optional keyword search
        keyword = st.text_input("Keyword in sentiment text", placeholder="e.g. hostel, fees, exam")

        # Optional date range filter if a date-like column exists
        date_col_candidates = [c for c in df_all.columns if c.lower() in ["date", "created_at", "timestamp"]]
        selected_date_col = None
        for c in date_col_candidates:
            s = pd.to_datetime(df_all[c], errors="coerce")
            if s.notna().sum() > 0:
                selected_date_col = c
                df_all["__dt"] = s
                break
        if selected_date_col:
            min_date = pd.to_datetime(df_all["__dt"].min()).date()
            max_date = pd.to_datetime(df_all["__dt"].max()).date()
            start_date, end_date = st.date_input("Date range", value=(min_date, max_date))
        else:
            start_date, end_date = None, None

    # Apply filters
    filtered_df = df_all
    # Apply status filter
    if 'Resolved' in filtered_df.columns:
        if selected_status == "Resolved":
            resolved_mask = pd.to_datetime(filtered_df["Resolved"], errors="coerce").notna()
            filtered_df = filtered_df[resolved_mask]
        elif selected_status == "On Process":
            onproc_mask = filtered_df["Resolved"].astype(str).str.strip().str.lower() == "on process"
            filtered_df = filtered_df[onproc_mask]

    # Apply category filter
    if has_category and selected_category != "All":
        filtered_df = filtered_df[filtered_df["Category"] == selected_category]
    if keyword:
        text_col = "Raw_Sentiments" if "Raw_Sentiments" in filtered_df.columns else None
        if text_col:
            filtered_df = filtered_df[filtered_df[text_col].astype(str).str.contains(keyword, case=False, na=False)]
    # Apply date filter
    if "__dt" in df_all.columns and start_date and end_date:
        mask = (df_all["__dt"].dt.date >= start_date) & (df_all["__dt"].dt.date <= end_date)
        filtered_df = filtered_df[mask.loc[filtered_df.index]]

    tabs = st.tabs(["Overview", "Details", "Insights", "Chatbot"])

    with tabs[0]:
        st.subheader("Students Sentiments")
        if filtered_df.empty:
            st.info("No results match the current filters. Try clearing the keyword or expanding the date range.")
        else:
            # If sentiments exist, show KPIs up top for quick overview
            if "Sentiment" in filtered_df.columns:
                total_complaints = len(filtered_df)
                pos = (filtered_df["Sentiment"] == "Positive").sum()
                neg = (filtered_df["Sentiment"] == "Negative").sum()
                neu = (filtered_df["Sentiment"] == "Neutral").sum()
                k1, k2, k3, k4 = st.columns(4)
                with k1:
                    st.markdown("<div class='metric-card'><div class='metric-label'>Total</div><div class='metric-value'>" + str(total_complaints) + "</div></div>", unsafe_allow_html=True)
                with k2:
                    st.markdown("<div class='metric-card'><div class='metric-label'>Negative</div><div class='metric-value'>" + str(neg) + "</div></div>", unsafe_allow_html=True)
                with k3:
                    st.markdown("<div class='metric-card'><div class='metric-label'>Neutral</div><div class='metric-value'>" + str(neu) + "</div></div>", unsafe_allow_html=True)
                with k4:
                    st.markdown("<div class='metric-card'><div class='metric-label'>Positive</div><div class='metric-value'>" + str(pos) + "</div></div>", unsafe_allow_html=True)
                st.divider()

            st.dataframe(filtered_df.drop(columns=["Sentiment"], errors="ignore"))

    # Visualization using Plotly if sentiment analysis has been performed
    if "Sentiment" in st.session_state["df"].columns:
        with tabs[1]:
            # KPI cards
            total_complaints = len(filtered_df)
            pos = (filtered_df["Sentiment"] == "Positive").sum() if "Sentiment" in filtered_df.columns else 0
            neg = (filtered_df["Sentiment"] == "Negative").sum() if "Sentiment" in filtered_df.columns else 0
            neu = (filtered_df["Sentiment"] == "Neutral").sum() if "Sentiment" in filtered_df.columns else 0
            # Accurate total sentiments counts only rows that have a classified sentiment label
            total_sentiments = int(filtered_df["Sentiment"].isin(["Positive", "Negative", "Neutral"]).sum()) if "Sentiment" in filtered_df.columns else 0

            k1, k2, k3, k4 = st.columns(4)
            with k1:
                st.markdown("<div class='metric-card'><div class='metric-label'>Total Sentiments</div><div class='metric-value'>" + str(total_sentiments) + "</div></div>", unsafe_allow_html=True)
            with k2:
                st.markdown("<div class='metric-card'><div class='metric-label'>Negative</div><div class='metric-value'>" + str(neg) + "</div></div>", unsafe_allow_html=True)
            with k3:
                st.markdown("<div class='metric-card'><div class='metric-label'>Neutral</div><div class='metric-value'>" + str(neu) + "</div></div>", unsafe_allow_html=True)
            with k4:
                st.markdown("<div class='metric-card'><div class='metric-label'>Positive</div><div class='metric-value'>" + str(pos) + "</div></div>", unsafe_allow_html=True)

            if 'selected_category' in locals() and selected_category != "All Categories":
                st.subheader(f"📊 Sentiment Breakdown - {selected_category}")
            else:
                st.subheader("📊 Sentiment Breakdown")
            # Create counts first (used by pie and bar)
            sentiment_counts = filtered_df["Sentiment"].value_counts().reset_index()
            sentiment_counts.columns = ['Sentiment', 'Count']
            # Optional extra: pie chart of sentiments with explicit colors
            pie_fig = px.pie(
                sentiment_counts,
                names="Sentiment",
                values="Count",
                title="Sentiment Percentage Distribution",
                color="Sentiment",
                color_discrete_map={
                    "Positive": "#00FF00",
                    "Neutral": "#FFFF00",  # valid yellow
                    "Negative": "#FF0000",
                }
            )
            # Show only percentages inside slices; black and bold text
            pie_fig.update_traces(
                textposition="inside",
                textinfo="percent",
                textfont=dict(size=14, color="black", family="Arial Black")
            )
            pie_fig.update_layout(font=dict(size=14, family="Arial Black"))
            st.plotly_chart(pie_fig, use_container_width=True, key="details_pie_sentiments")

            # Define custom order and colors (Positive, Neutral, Negative)
            sentiment_order = ['Positive', 'Neutral', 'Negative']
            sentiment_colors = {
                'Positive': '#00FF00',
                'Neutral': '#FFFF00',  # corrected to valid yellow
                'Negative': '#FF0000'
            }
            # Only include sentiment categories that actually exist in the data
            existing_sentiments = sentiment_counts['Sentiment'].unique()
            filtered_order = [s for s in sentiment_order if s in existing_sentiments]
            filtered_colors = {s: sentiment_colors[s] for s in existing_sentiments if s in sentiment_colors}
            # Reorder the data according to our custom order (only for existing sentiments)
            sentiment_counts['Sentiment'] = pd.Categorical(sentiment_counts['Sentiment'], categories=filtered_order, ordered=True)
            sentiment_counts = sentiment_counts.sort_values('Sentiment')
            fig = px.bar(
                sentiment_counts,
                x="Sentiment",
                y="Count",
                title="   Sentiment Classifications",
                labels={"Sentiment": "Sentiment Category", "Count": "Number of Sentiments"},
                color="Sentiment",
                color_discrete_map=filtered_colors
            )
            fig.update_layout(xaxis_title="Sentiment Classifications", yaxis_title="Number of Sentiments", showlegend=False)
            st.plotly_chart(fig, use_container_width=True, key="details_bar_sentiments")

            # Additional breakdown: Category distribution for the same filtered data
            if "Category" in filtered_df.columns:
                if 'selected_category' in locals() and selected_category != "All Categories":
                    st.subheader(f"📊 Category Breakdown - {selected_category}")
                else:
                    st.subheader("📊 Category Breakdown")
                category_counts = filtered_df["Category"].value_counts().reset_index()
                category_counts.columns = ["Category", "Count"]
                fig_cat = px.bar(
                    category_counts,
                    x="Category",
                    y="Count",
                    title="Distribution of Categories",
                    labels={"Category": "Category", "Count": "Number of Sentiments"},
                    color="Category",
                    color_discrete_map={
                        "Administration": "#2323FF",
                        "Physical Facilities & Equipment": "#2323FF",
                        "Instruction": "#2323FF",
                    }
                )
                fig_cat.update_layout(xaxis_title="Distribution of Categories", yaxis_title="Number of Sentiments", showlegend=False)
                st.plotly_chart(fig_cat, use_container_width=True, key="details_bar_categories")

        with tabs[2]:
            # Insights
            if "Sentiment" in filtered_df.columns:
                neg_df = filtered_df[filtered_df["Sentiment"] == "Negative"]

                # Sentiments by Category (Positive, Neutral, Negative)
                if "Category" in filtered_df.columns:
                    # Positive by Category
                    pos_cat = (
                        filtered_df[filtered_df["Sentiment"] == "Positive"]
                        .groupby("Category")
                        .size()
                        .reset_index(name="Count")
                        .sort_values("Count", ascending=False)
                    )
                    if not pos_cat.empty:
                        st.subheader("👍 Positive Sentiments by Category")
                        fig_pos_cat = px.bar(
                            pos_cat,
                            x="Category",
                            y="Count",
                            title=None,
                            labels={"Category": "Category", "Count": "Positive Count"},
                        )
                        fig_pos_cat.update_traces(marker_color="#00FF00")
                        fig_pos_cat.update_layout(xaxis_title="Positive Sentiments by Category", yaxis_title="Positive Count", showlegend=False)
                        st.plotly_chart(fig_pos_cat, use_container_width=True, key="insights_pos_by_cat")
                        

                    # Neutral by Category
                    neu_cat = (
                        filtered_df[filtered_df["Sentiment"] == "Neutral"]
                        .groupby("Category")
                        .size()
                        .reset_index(name="Count")
                        .sort_values("Count", ascending=False)
                    )
                    if not neu_cat.empty:
                        st.subheader("😐 Neutral Sentiments by Category")
                        fig_neu_cat = px.bar(
                            neu_cat,
                            x="Category",
                            y="Count",
                            title=None,
                            labels={"Category": "Category", "Count": "Neutral Count"},
                        )
                        fig_neu_cat.update_traces(marker_color="#FFFF00")
                        fig_neu_cat.update_layout(xaxis_title="Neutral Sentiments by Category", yaxis_title="Neutral Count", showlegend=False)
                        st.plotly_chart(fig_neu_cat, use_container_width=True, key="insights_neu_by_cat")
                    

                    # Negative by Category
                    neg_cat_all = (
                        filtered_df[filtered_df["Sentiment"] == "Negative"]
                        .groupby("Category")
                        .size()
                        .reset_index(name="Count")
                        .sort_values("Count", ascending=False)
                    )
                    if not neg_cat_all.empty:
                        st.subheader("🚨 Negative Sentiments by Category")
                        fig_neg_cat_all = px.bar(
                            neg_cat_all,
                            x="Category",
                            y="Count",
                            title=None,
                            labels={"Category": "Category", "Count": "Negative Count"},
                        )
                        fig_neg_cat_all.update_traces(marker_color="#FF0000")
                        fig_neg_cat_all.update_layout(xaxis_title="Negative Sentiments by Category", yaxis_title="Negative Count", showlegend=False)
                        st.plotly_chart(fig_neg_cat_all, use_container_width=True, key="insights_neg_by_cat_all")
                        
                # Removed "Top Categories by Negative Sentiments" per request

        # Chatbot tab: LLM Q&A grounded on current dataset/filters
        with tabs[3]:
            st.subheader("What's on your mind?")
            if "chat_history" not in st.session_state:
                st.session_state["chat_history"] = []  # list of {role, content}

            # Chat bubbles styling for SMS-like layout
            st.markdown(
                """
                <style>
                .chat-bubble { max-width: 72%; padding: 10px 14px; border-radius: 16px; margin: 6px 0; line-height: 1.35; display: inline-block; }
                .chat-user { background: #2563eb; color: #ffffff; margin-left: auto; border-bottom-right-radius: 6px; }
                .chat-assistant { background: rgba(31,41,55,0.85); color: #e5e7eb; margin-right: auto; border: 1px solid rgba(255,255,255,0.08); border-bottom-left-radius: 6px; }
                .chat-row { display: flex; }
                .chat-row.user { justify-content: flex-end; }
                .chat-row.assistant { justify-content: flex-start; }
                </style>
                """,
                unsafe_allow_html=True,
            )

            # Construct lightweight context from the (filtered) data
            try:
                total_rows = len(filtered_df)
                cols = list(filtered_df.columns)
                sentiment_summary = (
                    filtered_df["Sentiment"].value_counts().to_dict()
                    if "Sentiment" in filtered_df.columns else {}
                )
                top_cats = (
                    filtered_df["Category"].value_counts().head(5).to_dict()
                    if "Category" in filtered_df.columns else {}
                )
                context_lines = [
                    f"Selected status: {selected_status}",
                    f"Selected category: {selected_category}",
                    f"Rows in current view: {total_rows}",
                    f"Columns: {', '.join(cols)}",
                    f"Sentiment counts: {sentiment_summary}",
                    f"Top categories: {top_cats}",
                ]
                # Add a few sample rows for grounding
                sample_texts = []
                if "Raw_Sentiments" in filtered_df.columns:
                    sample_texts = filtered_df["Raw_Sentiments"].dropna().astype(str).head(3).tolist()
                if sample_texts:
                    context_lines.append("Sample sentiments: " + " | ".join(sample_texts))
                context_block = "\n".join(context_lines)
            except Exception:
                context_block = "No context available."

            # Render existing chat
            for msg in st.session_state["chat_history"]:
                with st.chat_message(msg["role"]):
                    role_class = "user" if msg["role"] == "user" else "assistant"
                    bubble_class = "chat-user" if msg["role"] == "user" else "chat-assistant"
                    st.markdown(f"<div class='chat-row {role_class}'><div class='chat-bubble {bubble_class}'>" + msg["content"] + "</div></div>", unsafe_allow_html=True)

            user_msg = st.chat_input("")
            if user_msg:
                st.session_state["chat_history"].append({"role": "user", "content": user_msg})
                with st.chat_message("user"):
                    st.markdown(f"<div class='chat-row user'><div class='chat-bubble chat-user'>" + user_msg + "</div></div>", unsafe_allow_html=True)

                # Compose LLM messages with context
                sys_prompt = (
                    "You are an expert data analyst for a student sentiments dashboard. "
                    "Answer succinctly using ONLY the provided context when citing numbers. "
                    "If a question is outside the context, say what extra info is needed."
                )
                messages = [
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": f"Context about current view:\n{context_block}"},
                    {"role": "user", "content": user_msg},
                ]

                try:
                    resp = client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=messages,
                        temperature=0.2,
                        max_tokens=400
                    )
                    bot_text = resp.choices[0].message.content.strip()
                except Exception:
                    # Simple fallback: answer from basic stats
                    if "negative" in user_msg.lower() and "Sentiment" in filtered_df.columns:
                        neg_count = int((filtered_df["Sentiment"] == "Negative").sum())
                        bot_text = f"There are {neg_count} negative sentiments in the current view."
                    else:
                        bot_text = "I'm unable to reach the AI service right now. Please try again later."

                st.session_state["chat_history"].append({"role": "assistant", "content": bot_text})
                with st.chat_message("assistant"):
                    st.markdown(f"<div class='chat-row assistant'><div class='chat-bubble chat-assistant'>" + bot_text + "</div></div>", unsafe_allow_html=True)