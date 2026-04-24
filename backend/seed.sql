pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: detail: taxonomy_tag
pg_dump: hint: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: hint: Consider using a full dump instead of a --data-only dump to avoid this problem.
pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: detail: taxonomy_category
pg_dump: hint: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: hint: Consider using a full dump instead of a --data-only dump to avoid this problem.
--
-- PostgreSQL database dump
--

\restrict EljhhH0LmYiqeelbID9Yjw5o99m7oEWgb44rCtrRVmxJsHc5DYi8f5xQ1MRPTDa

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.auth_group DISABLE TRIGGER ALL;



ALTER TABLE public.auth_group ENABLE TRIGGER ALL;

--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.django_content_type DISABLE TRIGGER ALL;

INSERT INTO public.django_content_type VALUES (1, 'admin', 'logentry');
INSERT INTO public.django_content_type VALUES (2, 'auth', 'permission');
INSERT INTO public.django_content_type VALUES (3, 'auth', 'group');
INSERT INTO public.django_content_type VALUES (4, 'auth', 'user');
INSERT INTO public.django_content_type VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO public.django_content_type VALUES (6, 'sessions', 'session');
INSERT INTO public.django_content_type VALUES (7, 'qa', 'question');
INSERT INTO public.django_content_type VALUES (8, 'qa', 'answer');
INSERT INTO public.django_content_type VALUES (9, 'qa', 'answervote');
INSERT INTO public.django_content_type VALUES (10, 'qa', 'answercomment');
INSERT INTO public.django_content_type VALUES (11, 'qa', 'questioncomment');
INSERT INTO public.django_content_type VALUES (12, 'qa', 'questionvote');
INSERT INTO public.django_content_type VALUES (13, 'taxonomy', 'tag');
INSERT INTO public.django_content_type VALUES (14, 'taxonomy', 'category');


ALTER TABLE public.django_content_type ENABLE TRIGGER ALL;

--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_permission DISABLE TRIGGER ALL;

INSERT INTO public.auth_permission VALUES (1, 'Can add log entry', 1, 'add_logentry');
INSERT INTO public.auth_permission VALUES (2, 'Can change log entry', 1, 'change_logentry');
INSERT INTO public.auth_permission VALUES (3, 'Can delete log entry', 1, 'delete_logentry');
INSERT INTO public.auth_permission VALUES (4, 'Can view log entry', 1, 'view_logentry');
INSERT INTO public.auth_permission VALUES (5, 'Can add permission', 2, 'add_permission');
INSERT INTO public.auth_permission VALUES (6, 'Can change permission', 2, 'change_permission');
INSERT INTO public.auth_permission VALUES (7, 'Can delete permission', 2, 'delete_permission');
INSERT INTO public.auth_permission VALUES (8, 'Can view permission', 2, 'view_permission');
INSERT INTO public.auth_permission VALUES (9, 'Can add group', 3, 'add_group');
INSERT INTO public.auth_permission VALUES (10, 'Can change group', 3, 'change_group');
INSERT INTO public.auth_permission VALUES (11, 'Can delete group', 3, 'delete_group');
INSERT INTO public.auth_permission VALUES (12, 'Can view group', 3, 'view_group');
INSERT INTO public.auth_permission VALUES (13, 'Can add user', 4, 'add_user');
INSERT INTO public.auth_permission VALUES (14, 'Can change user', 4, 'change_user');
INSERT INTO public.auth_permission VALUES (15, 'Can delete user', 4, 'delete_user');
INSERT INTO public.auth_permission VALUES (16, 'Can view user', 4, 'view_user');
INSERT INTO public.auth_permission VALUES (17, 'Can add content type', 5, 'add_contenttype');
INSERT INTO public.auth_permission VALUES (18, 'Can change content type', 5, 'change_contenttype');
INSERT INTO public.auth_permission VALUES (19, 'Can delete content type', 5, 'delete_contenttype');
INSERT INTO public.auth_permission VALUES (20, 'Can view content type', 5, 'view_contenttype');
INSERT INTO public.auth_permission VALUES (21, 'Can add session', 6, 'add_session');
INSERT INTO public.auth_permission VALUES (22, 'Can change session', 6, 'change_session');
INSERT INTO public.auth_permission VALUES (23, 'Can delete session', 6, 'delete_session');
INSERT INTO public.auth_permission VALUES (24, 'Can view session', 6, 'view_session');
INSERT INTO public.auth_permission VALUES (25, 'Can add question', 7, 'add_question');
INSERT INTO public.auth_permission VALUES (26, 'Can change question', 7, 'change_question');
INSERT INTO public.auth_permission VALUES (27, 'Can delete question', 7, 'delete_question');
INSERT INTO public.auth_permission VALUES (28, 'Can view question', 7, 'view_question');
INSERT INTO public.auth_permission VALUES (29, 'Can add answer', 8, 'add_answer');
INSERT INTO public.auth_permission VALUES (30, 'Can change answer', 8, 'change_answer');
INSERT INTO public.auth_permission VALUES (31, 'Can delete answer', 8, 'delete_answer');
INSERT INTO public.auth_permission VALUES (32, 'Can view answer', 8, 'view_answer');
INSERT INTO public.auth_permission VALUES (33, 'Can add answer vote', 9, 'add_answervote');
INSERT INTO public.auth_permission VALUES (34, 'Can change answer vote', 9, 'change_answervote');
INSERT INTO public.auth_permission VALUES (35, 'Can delete answer vote', 9, 'delete_answervote');
INSERT INTO public.auth_permission VALUES (36, 'Can view answer vote', 9, 'view_answervote');
INSERT INTO public.auth_permission VALUES (37, 'Can add answer comment', 10, 'add_answercomment');
INSERT INTO public.auth_permission VALUES (38, 'Can change answer comment', 10, 'change_answercomment');
INSERT INTO public.auth_permission VALUES (39, 'Can delete answer comment', 10, 'delete_answercomment');
INSERT INTO public.auth_permission VALUES (40, 'Can view answer comment', 10, 'view_answercomment');
INSERT INTO public.auth_permission VALUES (41, 'Can add question comment', 11, 'add_questioncomment');
INSERT INTO public.auth_permission VALUES (42, 'Can change question comment', 11, 'change_questioncomment');
INSERT INTO public.auth_permission VALUES (43, 'Can delete question comment', 11, 'delete_questioncomment');
INSERT INTO public.auth_permission VALUES (44, 'Can view question comment', 11, 'view_questioncomment');
INSERT INTO public.auth_permission VALUES (45, 'Can add question vote', 12, 'add_questionvote');
INSERT INTO public.auth_permission VALUES (46, 'Can change question vote', 12, 'change_questionvote');
INSERT INTO public.auth_permission VALUES (47, 'Can delete question vote', 12, 'delete_questionvote');
INSERT INTO public.auth_permission VALUES (48, 'Can view question vote', 12, 'view_questionvote');
INSERT INTO public.auth_permission VALUES (49, 'Can add tag', 13, 'add_tag');
INSERT INTO public.auth_permission VALUES (50, 'Can change tag', 13, 'change_tag');
INSERT INTO public.auth_permission VALUES (51, 'Can delete tag', 13, 'delete_tag');
INSERT INTO public.auth_permission VALUES (52, 'Can view tag', 13, 'view_tag');
INSERT INTO public.auth_permission VALUES (53, 'Can add category', 14, 'add_category');
INSERT INTO public.auth_permission VALUES (54, 'Can change category', 14, 'change_category');
INSERT INTO public.auth_permission VALUES (55, 'Can delete category', 14, 'delete_category');
INSERT INTO public.auth_permission VALUES (56, 'Can view category', 14, 'view_category');


ALTER TABLE public.auth_permission ENABLE TRIGGER ALL;

--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_group_permissions DISABLE TRIGGER ALL;



ALTER TABLE public.auth_group_permissions ENABLE TRIGGER ALL;

--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user DISABLE TRIGGER ALL;

INSERT INTO public.auth_user VALUES (1, 'pbkdf2_sha256$1000000$SIgrdVZWv89DFYSMuiwlmg$i7qDjKb2pp+FHg6jxEOsc1/DPkYaYo56GicOWvY/3Zw=', '2026-04-24 10:44:25.40702+00', true, 'admin', '', '', 'admin@example.com', true, true, '2026-04-24 10:32:48.882092+00');
INSERT INTO public.auth_user VALUES (2, 'pbkdf2_sha256$1000000$H7dXoAZEXhXYhdJbPY7MuC$+WlgxIMllmRfRna+ri6/64Frr8gqE0ilGY6Msu/prh0=', NULL, false, 'demo', '', '', 'demo@example.com', false, true, '2026-04-24 10:32:54.824935+00');
INSERT INTO public.auth_user VALUES (3, 'pbkdf2_sha256$1000000$CLemGVeSJMhLGo1pQaNZsW$ng120Qs4MczhqI43NtaRmt9UvYec33jEQNcU+rIgpso=', NULL, false, 'helper', '', '', 'helper@example.com', false, true, '2026-04-24 10:32:54.826144+00');


ALTER TABLE public.auth_user ENABLE TRIGGER ALL;

--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_groups DISABLE TRIGGER ALL;



ALTER TABLE public.auth_user_groups ENABLE TRIGGER ALL;

--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_user_permissions DISABLE TRIGGER ALL;



ALTER TABLE public.auth_user_user_permissions ENABLE TRIGGER ALL;

--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.django_admin_log DISABLE TRIGGER ALL;



ALTER TABLE public.django_admin_log ENABLE TRIGGER ALL;

--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.django_migrations DISABLE TRIGGER ALL;

INSERT INTO public.django_migrations VALUES (1, 'contenttypes', '0001_initial', '2026-04-24 10:32:41.960323+00');
INSERT INTO public.django_migrations VALUES (2, 'auth', '0001_initial', '2026-04-24 10:32:41.99231+00');
INSERT INTO public.django_migrations VALUES (3, 'admin', '0001_initial', '2026-04-24 10:32:42.000267+00');
INSERT INTO public.django_migrations VALUES (4, 'admin', '0002_logentry_remove_auto_add', '2026-04-24 10:32:42.00247+00');
INSERT INTO public.django_migrations VALUES (5, 'admin', '0003_logentry_add_action_flag_choices', '2026-04-24 10:32:42.005419+00');
INSERT INTO public.django_migrations VALUES (6, 'contenttypes', '0002_remove_content_type_name', '2026-04-24 10:32:42.012+00');
INSERT INTO public.django_migrations VALUES (7, 'auth', '0002_alter_permission_name_max_length', '2026-04-24 10:32:42.015622+00');
INSERT INTO public.django_migrations VALUES (8, 'auth', '0003_alter_user_email_max_length', '2026-04-24 10:32:42.019054+00');
INSERT INTO public.django_migrations VALUES (9, 'auth', '0004_alter_user_username_opts', '2026-04-24 10:32:42.021613+00');
INSERT INTO public.django_migrations VALUES (10, 'auth', '0005_alter_user_last_login_null', '2026-04-24 10:32:42.025749+00');
INSERT INTO public.django_migrations VALUES (11, 'auth', '0006_require_contenttypes_0002', '2026-04-24 10:32:42.026947+00');
INSERT INTO public.django_migrations VALUES (12, 'auth', '0007_alter_validators_add_error_messages', '2026-04-24 10:32:42.029852+00');
INSERT INTO public.django_migrations VALUES (13, 'auth', '0008_alter_user_username_max_length', '2026-04-24 10:32:42.0355+00');
INSERT INTO public.django_migrations VALUES (14, 'auth', '0009_alter_user_last_name_max_length', '2026-04-24 10:32:42.039416+00');
INSERT INTO public.django_migrations VALUES (15, 'auth', '0010_alter_group_name_max_length', '2026-04-24 10:32:42.043061+00');
INSERT INTO public.django_migrations VALUES (16, 'auth', '0011_update_proxy_permissions', '2026-04-24 10:32:42.046251+00');
INSERT INTO public.django_migrations VALUES (17, 'auth', '0012_alter_user_first_name_max_length', '2026-04-24 10:32:42.050303+00');
INSERT INTO public.django_migrations VALUES (18, 'taxonomy', '0001_initial', '2026-04-24 10:32:42.062754+00');
INSERT INTO public.django_migrations VALUES (19, 'taxonomy', '0002_category', '2026-04-24 10:32:42.070574+00');
INSERT INTO public.django_migrations VALUES (20, 'qa', '0001_initial', '2026-04-24 10:32:42.084129+00');
INSERT INTO public.django_migrations VALUES (21, 'qa', '0002_answer', '2026-04-24 10:32:42.095573+00');
INSERT INTO public.django_migrations VALUES (22, 'qa', '0003_answervote', '2026-04-24 10:32:42.107103+00');
INSERT INTO public.django_migrations VALUES (23, 'qa', '0004_answercomment_questioncomment', '2026-04-24 10:32:42.126518+00');
INSERT INTO public.django_migrations VALUES (24, 'qa', '0005_question_category_alter_question_tags_questionvote', '2026-04-24 10:32:42.146156+00');
INSERT INTO public.django_migrations VALUES (25, 'sessions', '0001_initial', '2026-04-24 10:32:42.153218+00');
INSERT INTO public.django_migrations VALUES (26, 'taxonomy', '0003_alter_category_slug', '2026-04-24 10:32:42.155894+00');


ALTER TABLE public.django_migrations ENABLE TRIGGER ALL;

--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.django_session DISABLE TRIGGER ALL;

INSERT INTO public.django_session VALUES ('z4zjy7lpw08gh1tec2gfcio8m5cpywdk', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGDw8:gqrdOya-ofenlYc-_6Uy3GTkp1-XfB4LMTYGAXBrnEY', '2026-05-08 10:39:04.517595+00');
INSERT INTO public.django_session VALUES ('uun1n5ri3qhisltptk7ho7o10p0nfn3o', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE0x:Gw51XMKqZxZuM3ItyMEVL1j5FHLbYxAzPtd1HTCGIOo', '2026-05-08 10:44:03.717946+00');
INSERT INTO public.django_session VALUES ('kq62900otbv239xjk8b4tq4w3b2loo2l', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE0y:QyaRozbvQMdlqo-22SDrP-X5PDwxT3X3H74oX1HNF4I', '2026-05-08 10:44:04.122727+00');
INSERT INTO public.django_session VALUES ('h29vopq22db5nhs49ofejro7pcgzppnm', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE0y:QyaRozbvQMdlqo-22SDrP-X5PDwxT3X3H74oX1HNF4I', '2026-05-08 10:44:04.656569+00');
INSERT INTO public.django_session VALUES ('gl16ejf010dmsk6ejwhcvtp5u4vww0za', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE10:PLXOpejd2mmTjfxd6aYdcp8h38mhpjzFa0kc9GatEN0', '2026-05-08 10:44:06.215514+00');
INSERT INTO public.django_session VALUES ('1kiryf1owhqvnyl7di1bs39a8awuhqn0', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE11:BmQaNzfC76B9TlD2f6oynBI2fF3F2RUfCZljWsISu7U', '2026-05-08 10:44:07.761903+00');
INSERT INTO public.django_session VALUES ('cqyqhfittb8c6z5ylujg12n76hp659de', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE12:pJAW_c1TSStGwAokcw77_4E_yI2oo5SmiRPqUb5JA90', '2026-05-08 10:44:08.18278+00');
INSERT INTO public.django_session VALUES ('l81inw5ye4bfc91k60eusb7jusvbvlex', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE12:pJAW_c1TSStGwAokcw77_4E_yI2oo5SmiRPqUb5JA90', '2026-05-08 10:44:08.597135+00');
INSERT INTO public.django_session VALUES ('7a6zmc4wzcoli4u9fdcaqvh4fx37y7jy', '.eJxVjDsOwjAQBe_iGlnYXv8o6XMGa9cfHEC2FCcV4u4QKQW0b2beiwXc1hq2kZcwJ3Zhgp1-N8L4yG0H6Y7t1nnsbV1m4rvCDzr41FN-Xg_376DiqN_akAAQZwlOWUJw2gpPOUWrizYUiwYERVlHCdF7A6QkFCXIW1Fcyoa9P8gnN3w:1wGE1J:T_PMKHSpaQpS4LMd5kKsdGOvKppLUShkkc-b5pe3BwM', '2026-05-08 10:44:25.408364+00');


ALTER TABLE public.django_session ENABLE TRIGGER ALL;

--
-- Data for Name: taxonomy_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.taxonomy_category DISABLE TRIGGER ALL;

INSERT INTO public.taxonomy_category VALUES (1, '2026-04-24 10:32:54.575553+00', '2026-04-24 10:32:54.575561+00', 'Customer', 'customer', true, 'Questions related to Customer offerings.', NULL);
INSERT INTO public.taxonomy_category VALUES (2, '2026-04-24 10:32:54.582956+00', '2026-04-24 10:32:54.582962+00', 'Fullstack Development', 'customer.fullstack-development', true, 'Fullstack Development under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (3, '2026-04-24 10:32:54.589047+00', '2026-04-24 10:32:54.58905+00', 'Java', 'customer.fullstack-development.java', true, 'Java topic.', 2);
INSERT INTO public.taxonomy_category VALUES (4, '2026-04-24 10:32:54.594324+00', '2026-04-24 10:32:54.594326+00', 'Python', 'customer.fullstack-development.python', true, 'Python topic.', 2);
INSERT INTO public.taxonomy_category VALUES (5, '2026-04-24 10:32:54.598012+00', '2026-04-24 10:32:54.598016+00', 'Javascript', 'customer.fullstack-development.javascript', true, 'Javascript topic.', 2);
INSERT INTO public.taxonomy_category VALUES (6, '2026-04-24 10:32:54.601931+00', '2026-04-24 10:32:54.601934+00', 'Typescript', 'customer.fullstack-development.typescript', true, 'Typescript topic.', 2);
INSERT INTO public.taxonomy_category VALUES (7, '2026-04-24 10:32:54.60599+00', '2026-04-24 10:32:54.605993+00', 'React', 'customer.fullstack-development.react', true, 'React topic.', 2);
INSERT INTO public.taxonomy_category VALUES (8, '2026-04-24 10:32:54.610393+00', '2026-04-24 10:32:54.610395+00', 'Angular', 'customer.fullstack-development.angular', true, 'Angular topic.', 2);
INSERT INTO public.taxonomy_category VALUES (9, '2026-04-24 10:32:54.614319+00', '2026-04-24 10:32:54.614324+00', 'Vue Js', 'customer.fullstack-development.vue-js', true, 'Vue Js topic.', 2);
INSERT INTO public.taxonomy_category VALUES (10, '2026-04-24 10:32:54.617973+00', '2026-04-24 10:32:54.617976+00', 'Node Js', 'customer.fullstack-development.node-js', true, 'Node Js topic.', 2);
INSERT INTO public.taxonomy_category VALUES (11, '2026-04-24 10:32:54.621539+00', '2026-04-24 10:32:54.621541+00', 'Spring Boot', 'customer.fullstack-development.spring-boot', true, 'Spring Boot topic.', 2);
INSERT INTO public.taxonomy_category VALUES (12, '2026-04-24 10:32:54.624879+00', '2026-04-24 10:32:54.624882+00', 'Django', 'customer.fullstack-development.django', true, 'Django topic.', 2);
INSERT INTO public.taxonomy_category VALUES (13, '2026-04-24 10:32:54.62806+00', '2026-04-24 10:32:54.628063+00', 'Fastapi', 'customer.fullstack-development.fastapi', true, 'Fastapi topic.', 2);
INSERT INTO public.taxonomy_category VALUES (14, '2026-04-24 10:32:54.63115+00', '2026-04-24 10:32:54.631153+00', 'Next Js', 'customer.fullstack-development.next-js', true, 'Next Js topic.', 2);
INSERT INTO public.taxonomy_category VALUES (15, '2026-04-24 10:32:54.634073+00', '2026-04-24 10:32:54.634078+00', 'Express Js', 'customer.fullstack-development.express-js', true, 'Express Js topic.', 2);
INSERT INTO public.taxonomy_category VALUES (16, '2026-04-24 10:32:54.636632+00', '2026-04-24 10:32:54.636635+00', 'Backend Development', 'customer.backend-development', true, 'Backend Development under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (17, '2026-04-24 10:32:54.639192+00', '2026-04-24 10:32:54.639195+00', 'Frontend Development', 'customer.frontend-development', true, 'Frontend Development under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (18, '2026-04-24 10:32:54.641535+00', '2026-04-24 10:32:54.641539+00', 'Mobile App Development', 'customer.mobile-app-development', true, 'Mobile App Development under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (19, '2026-04-24 10:32:54.643851+00', '2026-04-24 10:32:54.643855+00', 'Devops', 'customer.devops', true, 'Devops under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (20, '2026-04-24 10:32:54.65155+00', '2026-04-24 10:32:54.651554+00', 'Qa Testing', 'customer.qa-testing', true, 'Qa Testing under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (21, '2026-04-24 10:32:54.658557+00', '2026-04-24 10:32:54.65856+00', 'Ui Ux Design', 'customer.ui-ux-design', true, 'Ui Ux Design under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (22, '2026-04-24 10:32:54.661171+00', '2026-04-24 10:32:54.661174+00', 'Technical Support', 'customer.technical-support', true, 'Technical Support under Customer.', 1);
INSERT INTO public.taxonomy_category VALUES (23, '2026-04-24 10:32:54.663471+00', '2026-04-24 10:32:54.663477+00', 'Internal', 'internal', true, 'Questions related to Internal offerings.', NULL);
INSERT INTO public.taxonomy_category VALUES (24, '2026-04-24 10:32:54.666074+00', '2026-04-24 10:32:54.666076+00', 'Fullstack Development', 'internal.fullstack-development', true, 'Fullstack Development under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (25, '2026-04-24 10:32:54.668544+00', '2026-04-24 10:32:54.668547+00', 'Java', 'internal.fullstack-development.java', true, 'Java topic.', 24);
INSERT INTO public.taxonomy_category VALUES (26, '2026-04-24 10:32:54.670956+00', '2026-04-24 10:32:54.670959+00', 'Python', 'internal.fullstack-development.python', true, 'Python topic.', 24);
INSERT INTO public.taxonomy_category VALUES (27, '2026-04-24 10:32:54.67342+00', '2026-04-24 10:32:54.673423+00', 'Javascript', 'internal.fullstack-development.javascript', true, 'Javascript topic.', 24);
INSERT INTO public.taxonomy_category VALUES (28, '2026-04-24 10:32:54.675854+00', '2026-04-24 10:32:54.675857+00', 'Typescript', 'internal.fullstack-development.typescript', true, 'Typescript topic.', 24);
INSERT INTO public.taxonomy_category VALUES (29, '2026-04-24 10:32:54.678322+00', '2026-04-24 10:32:54.678325+00', 'React', 'internal.fullstack-development.react', true, 'React topic.', 24);
INSERT INTO public.taxonomy_category VALUES (30, '2026-04-24 10:32:54.680909+00', '2026-04-24 10:32:54.680912+00', 'Angular', 'internal.fullstack-development.angular', true, 'Angular topic.', 24);
INSERT INTO public.taxonomy_category VALUES (31, '2026-04-24 10:32:54.68341+00', '2026-04-24 10:32:54.683413+00', 'Vue Js', 'internal.fullstack-development.vue-js', true, 'Vue Js topic.', 24);
INSERT INTO public.taxonomy_category VALUES (32, '2026-04-24 10:32:54.685812+00', '2026-04-24 10:32:54.685814+00', 'Node Js', 'internal.fullstack-development.node-js', true, 'Node Js topic.', 24);
INSERT INTO public.taxonomy_category VALUES (33, '2026-04-24 10:32:54.688375+00', '2026-04-24 10:32:54.688378+00', 'Spring Boot', 'internal.fullstack-development.spring-boot', true, 'Spring Boot topic.', 24);
INSERT INTO public.taxonomy_category VALUES (34, '2026-04-24 10:32:54.690916+00', '2026-04-24 10:32:54.690919+00', 'Django', 'internal.fullstack-development.django', true, 'Django topic.', 24);
INSERT INTO public.taxonomy_category VALUES (35, '2026-04-24 10:32:54.693472+00', '2026-04-24 10:32:54.693475+00', 'Fastapi', 'internal.fullstack-development.fastapi', true, 'Fastapi topic.', 24);
INSERT INTO public.taxonomy_category VALUES (36, '2026-04-24 10:32:54.696105+00', '2026-04-24 10:32:54.69611+00', 'Next Js', 'internal.fullstack-development.next-js', true, 'Next Js topic.', 24);
INSERT INTO public.taxonomy_category VALUES (37, '2026-04-24 10:32:54.69874+00', '2026-04-24 10:32:54.698743+00', 'Express Js', 'internal.fullstack-development.express-js', true, 'Express Js topic.', 24);
INSERT INTO public.taxonomy_category VALUES (38, '2026-04-24 10:32:54.701297+00', '2026-04-24 10:32:54.701301+00', 'Backend Development', 'internal.backend-development', true, 'Backend Development under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (39, '2026-04-24 10:32:54.703853+00', '2026-04-24 10:32:54.703856+00', 'Frontend Development', 'internal.frontend-development', true, 'Frontend Development under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (40, '2026-04-24 10:32:54.706392+00', '2026-04-24 10:32:54.706394+00', 'Data Engineering', 'internal.data-engineering', true, 'Data Engineering under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (41, '2026-04-24 10:32:54.708925+00', '2026-04-24 10:32:54.708928+00', 'Devops', 'internal.devops', true, 'Devops under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (42, '2026-04-24 10:32:54.711458+00', '2026-04-24 10:32:54.711461+00', 'Infrastructure', 'internal.infrastructure', true, 'Infrastructure under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (43, '2026-04-24 10:32:54.714233+00', '2026-04-24 10:32:54.714236+00', 'Security', 'internal.security', true, 'Security under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (44, '2026-04-24 10:32:54.716988+00', '2026-04-24 10:32:54.716992+00', 'Authentication', 'internal.security.authentication', true, 'Authentication topic.', 43);
INSERT INTO public.taxonomy_category VALUES (45, '2026-04-24 10:32:54.719616+00', '2026-04-24 10:32:54.719619+00', 'Authorization', 'internal.security.authorization', true, 'Authorization topic.', 43);
INSERT INTO public.taxonomy_category VALUES (46, '2026-04-24 10:32:54.722273+00', '2026-04-24 10:32:54.722276+00', 'Oauth', 'internal.security.oauth', true, 'Oauth topic.', 43);
INSERT INTO public.taxonomy_category VALUES (47, '2026-04-24 10:32:54.724882+00', '2026-04-24 10:32:54.724885+00', 'Jwt', 'internal.security.jwt', true, 'Jwt topic.', 43);
INSERT INTO public.taxonomy_category VALUES (48, '2026-04-24 10:32:54.727428+00', '2026-04-24 10:32:54.727431+00', 'Encryption', 'internal.security.encryption', true, 'Encryption topic.', 43);
INSERT INTO public.taxonomy_category VALUES (49, '2026-04-24 10:32:54.72997+00', '2026-04-24 10:32:54.729974+00', 'Penetration Testing', 'internal.security.penetration-testing', true, 'Penetration Testing topic.', 43);
INSERT INTO public.taxonomy_category VALUES (50, '2026-04-24 10:32:54.732761+00', '2026-04-24 10:32:54.73277+00', 'Security Auditing', 'internal.security.security-auditing', true, 'Security Auditing topic.', 43);
INSERT INTO public.taxonomy_category VALUES (51, '2026-04-24 10:32:54.735325+00', '2026-04-24 10:32:54.735328+00', 'Project Management', 'internal.project-management', true, 'Project Management under Internal.', 23);
INSERT INTO public.taxonomy_category VALUES (52, '2026-04-24 10:32:54.737497+00', '2026-04-24 10:32:54.7375+00', 'Cloud', 'cloud', true, 'Questions related to Cloud offerings.', NULL);
INSERT INTO public.taxonomy_category VALUES (53, '2026-04-24 10:32:54.74007+00', '2026-04-24 10:32:54.740073+00', 'Cloud Architecture', 'cloud.cloud-architecture', true, 'Cloud Architecture under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (54, '2026-04-24 10:32:54.742651+00', '2026-04-24 10:32:54.742655+00', 'Aws', 'cloud.cloud-architecture.aws', true, 'Aws topic.', 53);
INSERT INTO public.taxonomy_category VALUES (55, '2026-04-24 10:32:54.74521+00', '2026-04-24 10:32:54.745213+00', 'Azure', 'cloud.cloud-architecture.azure', true, 'Azure topic.', 53);
INSERT INTO public.taxonomy_category VALUES (56, '2026-04-24 10:32:54.747781+00', '2026-04-24 10:32:54.747784+00', 'Gcp', 'cloud.cloud-architecture.gcp', true, 'Gcp topic.', 53);
INSERT INTO public.taxonomy_category VALUES (57, '2026-04-24 10:32:54.750518+00', '2026-04-24 10:32:54.750521+00', 'Terraform', 'cloud.cloud-architecture.terraform', true, 'Terraform topic.', 53);
INSERT INTO public.taxonomy_category VALUES (58, '2026-04-24 10:32:54.753008+00', '2026-04-24 10:32:54.753011+00', 'Cloudformation', 'cloud.cloud-architecture.cloudformation', true, 'Cloudformation topic.', 53);
INSERT INTO public.taxonomy_category VALUES (59, '2026-04-24 10:32:54.755446+00', '2026-04-24 10:32:54.755449+00', 'Architecture Design', 'cloud.cloud-architecture.architecture-design', true, 'Architecture Design topic.', 53);
INSERT INTO public.taxonomy_category VALUES (60, '2026-04-24 10:32:54.75782+00', '2026-04-24 10:32:54.757822+00', 'Microservices', 'cloud.cloud-architecture.microservices', true, 'Microservices topic.', 53);
INSERT INTO public.taxonomy_category VALUES (61, '2026-04-24 10:32:54.760231+00', '2026-04-24 10:32:54.760234+00', 'Serverless', 'cloud.cloud-architecture.serverless', true, 'Serverless topic.', 53);
INSERT INTO public.taxonomy_category VALUES (62, '2026-04-24 10:32:54.762662+00', '2026-04-24 10:32:54.762665+00', 'High Availability', 'cloud.cloud-architecture.high-availability', true, 'High Availability topic.', 53);
INSERT INTO public.taxonomy_category VALUES (63, '2026-04-24 10:32:54.765185+00', '2026-04-24 10:32:54.765189+00', 'Scalability', 'cloud.cloud-architecture.scalability', true, 'Scalability topic.', 53);
INSERT INTO public.taxonomy_category VALUES (64, '2026-04-24 10:32:54.767696+00', '2026-04-24 10:32:54.767698+00', 'Cloud Migration', 'cloud.cloud-migration', true, 'Cloud Migration under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (65, '2026-04-24 10:32:54.770059+00', '2026-04-24 10:32:54.770062+00', 'Devops', 'cloud.devops', true, 'Devops under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (66, '2026-04-24 10:32:54.772528+00', '2026-04-24 10:32:54.77253+00', 'Infrastructure As Code', 'cloud.infrastructure-as-code', true, 'Infrastructure As Code under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (67, '2026-04-24 10:32:54.774928+00', '2026-04-24 10:32:54.77493+00', 'Serverless', 'cloud.serverless', true, 'Serverless under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (68, '2026-04-24 10:32:54.777235+00', '2026-04-24 10:32:54.777238+00', 'Container Orchestration', 'cloud.container-orchestration', true, 'Container Orchestration under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (69, '2026-04-24 10:32:54.779649+00', '2026-04-24 10:32:54.779652+00', 'Cloud Security', 'cloud.cloud-security', true, 'Cloud Security under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (70, '2026-04-24 10:32:54.782299+00', '2026-04-24 10:32:54.782302+00', 'Cost Optimization', 'cloud.cost-optimization', true, 'Cost Optimization under Cloud.', 52);
INSERT INTO public.taxonomy_category VALUES (71, '2026-04-24 10:32:54.784315+00', '2026-04-24 10:32:54.784317+00', 'Ai Data', 'ai-data', true, 'Questions related to Ai Data offerings.', NULL);
INSERT INTO public.taxonomy_category VALUES (72, '2026-04-24 10:32:54.786584+00', '2026-04-24 10:32:54.786587+00', 'Genai Development', 'ai-data.genai-development', true, 'Genai Development under Ai Data.', 71);
INSERT INTO public.taxonomy_category VALUES (73, '2026-04-24 10:32:54.788835+00', '2026-04-24 10:32:54.788837+00', 'Machine Learning', 'ai-data.machine-learning', true, 'Machine Learning under Ai Data.', 71);
INSERT INTO public.taxonomy_category VALUES (74, '2026-04-24 10:32:54.791084+00', '2026-04-24 10:32:54.791087+00', 'Python', 'ai-data.machine-learning.python', true, 'Python topic.', 73);
INSERT INTO public.taxonomy_category VALUES (75, '2026-04-24 10:32:54.793313+00', '2026-04-24 10:32:54.793316+00', 'Tensorflow', 'ai-data.machine-learning.tensorflow', true, 'Tensorflow topic.', 73);
INSERT INTO public.taxonomy_category VALUES (76, '2026-04-24 10:32:54.795571+00', '2026-04-24 10:32:54.795575+00', 'Pytorch', 'ai-data.machine-learning.pytorch', true, 'Pytorch topic.', 73);
INSERT INTO public.taxonomy_category VALUES (77, '2026-04-24 10:32:54.797875+00', '2026-04-24 10:32:54.797878+00', 'Scikit Learn', 'ai-data.machine-learning.scikit-learn', true, 'Scikit Learn topic.', 73);
INSERT INTO public.taxonomy_category VALUES (78, '2026-04-24 10:32:54.800022+00', '2026-04-24 10:32:54.800024+00', 'Keras', 'ai-data.machine-learning.keras', true, 'Keras topic.', 73);
INSERT INTO public.taxonomy_category VALUES (79, '2026-04-24 10:32:54.802206+00', '2026-04-24 10:32:54.802209+00', 'Xgboost', 'ai-data.machine-learning.xgboost', true, 'Xgboost topic.', 73);
INSERT INTO public.taxonomy_category VALUES (80, '2026-04-24 10:32:54.804426+00', '2026-04-24 10:32:54.804429+00', 'Neural Networks', 'ai-data.machine-learning.neural-networks', true, 'Neural Networks topic.', 73);
INSERT INTO public.taxonomy_category VALUES (81, '2026-04-24 10:32:54.806546+00', '2026-04-24 10:32:54.806549+00', 'Deep Learning', 'ai-data.machine-learning.deep-learning', true, 'Deep Learning topic.', 73);
INSERT INTO public.taxonomy_category VALUES (82, '2026-04-24 10:32:54.808661+00', '2026-04-24 10:32:54.808664+00', 'Model Training', 'ai-data.machine-learning.model-training', true, 'Model Training topic.', 73);
INSERT INTO public.taxonomy_category VALUES (83, '2026-04-24 10:32:54.810775+00', '2026-04-24 10:32:54.810778+00', 'Feature Engineering', 'ai-data.machine-learning.feature-engineering', true, 'Feature Engineering topic.', 73);
INSERT INTO public.taxonomy_category VALUES (84, '2026-04-24 10:32:54.813068+00', '2026-04-24 10:32:54.813071+00', 'Data Engineering', 'ai-data.data-engineering', true, 'Data Engineering under Ai Data.', 71);
INSERT INTO public.taxonomy_category VALUES (85, '2026-04-24 10:32:54.815304+00', '2026-04-24 10:32:54.815307+00', 'Data Science', 'ai-data.data-science', true, 'Data Science under Ai Data.', 71);
INSERT INTO public.taxonomy_category VALUES (86, '2026-04-24 10:32:54.81747+00', '2026-04-24 10:32:54.817473+00', 'Data Analytics', 'ai-data.data-analytics', true, 'Data Analytics under Ai Data.', 71);
INSERT INTO public.taxonomy_category VALUES (87, '2026-04-24 10:32:54.819618+00', '2026-04-24 10:32:54.81962+00', 'Mlops', 'ai-data.mlops', true, 'Mlops under Ai Data.', 71);
INSERT INTO public.taxonomy_category VALUES (88, '2026-04-24 10:32:54.821763+00', '2026-04-24 10:32:54.821765+00', 'Nlp', 'ai-data.nlp', true, 'Nlp under Ai Data.', 71);
INSERT INTO public.taxonomy_category VALUES (89, '2026-04-24 10:32:54.823877+00', '2026-04-24 10:32:54.82388+00', 'Computer Vision', 'ai-data.computer-vision', true, 'Computer Vision under Ai Data.', 71);


ALTER TABLE public.taxonomy_category ENABLE TRIGGER ALL;

--
-- Data for Name: qa_question; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.qa_question DISABLE TRIGGER ALL;

INSERT INTO public.qa_question VALUES (1, '2026-04-24 10:32:54.827721+00', '2026-04-24 10:32:54.827723+00', 'Best practices for React state management in customer portals?', 'We''re building a customer-facing dashboard with complex nested state. Should we use Redux, Zustand, or React context for this scale? The app has ~50 routes and heavy real-time data.', 'open', 2, 7);
INSERT INTO public.qa_question VALUES (2, '2026-04-24 10:32:54.832344+00', '2026-04-24 10:32:54.832348+00', 'How to structure Django REST API for a multi-tenant SaaS?', 'We need to serve multiple customers from a single Django instance. What''s the recommended approach — schema-based, row-level, or separate databases?', 'open', 2, 12);
INSERT INTO public.qa_question VALUES (3, '2026-04-24 10:32:54.835267+00', '2026-04-24 10:32:54.835269+00', 'CI/CD pipeline keeps timing out on integration tests', 'Our GitHub Actions pipeline runs integration tests against a Postgres container and consistently times out after 20 minutes. The tests pass locally in 8 minutes. Any ideas on speeding this up?', 'open', 2, 41);
INSERT INTO public.qa_question VALUES (4, '2026-04-24 10:32:54.836932+00', '2026-04-24 10:32:54.836934+00', 'JWT refresh token rotation — best pattern?', 'We''re implementing token rotation for our internal auth service. Should we store refresh tokens in an HTTP-only cookie or in-memory? What''s the recommended expiry window?', 'open', 2, 47);
INSERT INTO public.qa_question VALUES (5, '2026-04-24 10:32:54.838469+00', '2026-04-24 10:32:54.838471+00', 'ECS vs EKS for microservices deployment?', 'We''re migrating 12 microservices to AWS. The team is split between ECS Fargate and EKS. What are the trade-offs in terms of operational overhead, cost, and developer experience?', 'open', 2, 54);
INSERT INTO public.qa_question VALUES (6, '2026-04-24 10:32:54.842446+00', '2026-04-24 10:32:54.842448+00', 'Managing Terraform state across multiple AWS accounts', 'We have dev, staging, and prod in separate AWS accounts. What''s the best way to organize Terraform state files and modules to avoid drift and enable safe cross-account deployments?', 'open', 2, 57);
INSERT INTO public.qa_question VALUES (7, '2026-04-24 10:32:54.843863+00', '2026-04-24 10:32:54.843865+00', 'Fine-tuning a pre-trained transformer for classification', 'I''m fine-tuning a BERT model on a small labeled dataset (~5k samples). Training loss decreases but validation accuracy plateaus at 78%. Any suggestions for regularization or data augmentation strategies?', 'open', 2, 76);
INSERT INTO public.qa_question VALUES (8, '2026-04-24 10:32:54.846566+00', '2026-04-24 10:32:54.846569+00', 'RAG pipeline latency — how to get under 2 seconds?', 'Our retrieval-augmented generation pipeline takes 4-5 seconds per query. We''re using pgvector for embeddings and GPT-4 for generation. Where are the typical bottlenecks and how can we reduce latency?', 'open', 2, 72);
INSERT INTO public.qa_question VALUES (9, '2026-04-24 10:32:54.848258+00', '2026-04-24 10:32:54.848261+00', 'Airflow vs Prefect for internal ETL orchestration?', 'We''re replacing our cron-based ETL system. The team is evaluating Apache Airflow and Prefect. What are the key differences for a team of 5 data engineers maintaining ~40 DAGs?', 'open', 2, 40);
INSERT INTO public.qa_question VALUES (10, '2026-04-24 10:32:54.849907+00', '2026-04-24 10:32:54.84991+00', 'Accessible form validation patterns for enterprise apps', 'We need to implement WCAG 2.1 AA compliant form validation across our customer-facing app. What libraries or patterns do you recommend for React that handle aria-live regions and focus management well?', 'open', 2, 17);


ALTER TABLE public.qa_question ENABLE TRIGGER ALL;

--
-- Data for Name: qa_answer; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.qa_answer DISABLE TRIGGER ALL;

INSERT INTO public.qa_answer VALUES (1, '2026-04-24 10:32:54.829213+00', '2026-04-24 10:32:54.829216+00', 'For 50+ routes with real-time data, I''d recommend Zustand over Redux. It has a much simpler API, great TypeScript support, and built-in middleware for persistence. We switched from Redux and cut boilerplate by 60%.', false, 3, 1);
INSERT INTO public.qa_answer VALUES (2, '2026-04-24 10:32:54.830658+00', '2026-04-24 10:32:54.830661+00', 'Consider a hybrid approach: React context for auth/theme state, and TanStack Query (React Query) for all server state. This eliminates most of what people use Redux for.', false, 3, 1);
INSERT INTO public.qa_answer VALUES (3, '2026-04-24 10:32:54.833727+00', '2026-04-24 10:32:54.83373+00', 'Row-level tenancy with a tenant_id FK on each model works best for most cases. Use a middleware to set the current tenant from the JWT/session, and create a custom manager that filters by tenant automatically.', false, 3, 2);
INSERT INTO public.qa_answer VALUES (4, '2026-04-24 10:32:54.839679+00', '2026-04-24 10:32:54.839682+00', 'ECS Fargate is significantly easier to operate if your team doesn''t have deep Kubernetes experience. The cost is slightly higher per-container, but you save on DevOps headcount. EKS makes sense if you need portability or already have K8s expertise.', false, 3, 5);
INSERT INTO public.qa_answer VALUES (5, '2026-04-24 10:32:54.840942+00', '2026-04-24 10:32:54.840944+00', 'We run both — ECS for simple HTTP services and EKS for workloads that need custom scheduling, GPU access, or complex networking. Don''t pick one exclusively.', false, 3, 5);
INSERT INTO public.qa_answer VALUES (6, '2026-04-24 10:32:54.845008+00', '2026-04-24 10:32:54.84501+00', 'With only 5k samples, try these: 1) Use a lower learning rate (2e-5), 2) Add label smoothing, 3) Use gradual unfreezing — train only the classifier head first, then unfreeze transformer layers progressively.', false, 3, 7);


ALTER TABLE public.qa_answer ENABLE TRIGGER ALL;

--
-- Data for Name: qa_answercomment; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.qa_answercomment DISABLE TRIGGER ALL;



ALTER TABLE public.qa_answercomment ENABLE TRIGGER ALL;

--
-- Data for Name: qa_answervote; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.qa_answervote DISABLE TRIGGER ALL;



ALTER TABLE public.qa_answervote ENABLE TRIGGER ALL;

--
-- Data for Name: taxonomy_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.taxonomy_tag DISABLE TRIGGER ALL;



ALTER TABLE public.taxonomy_tag ENABLE TRIGGER ALL;

--
-- Data for Name: qa_question_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.qa_question_tags DISABLE TRIGGER ALL;



ALTER TABLE public.qa_question_tags ENABLE TRIGGER ALL;

--
-- Data for Name: qa_questioncomment; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.qa_questioncomment DISABLE TRIGGER ALL;



ALTER TABLE public.qa_questioncomment ENABLE TRIGGER ALL;

--
-- Data for Name: qa_questionvote; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.qa_questionvote DISABLE TRIGGER ALL;



ALTER TABLE public.qa_questionvote ENABLE TRIGGER ALL;

--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 56, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 3, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 14, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 26, true);


--
-- Name: qa_answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_answer_id_seq', 6, true);


--
-- Name: qa_answercomment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_answercomment_id_seq', 1, false);


--
-- Name: qa_answervote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_answervote_id_seq', 1, false);


--
-- Name: qa_question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_question_id_seq', 10, true);


--
-- Name: qa_question_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_question_tags_id_seq', 1, false);


--
-- Name: qa_questioncomment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_questioncomment_id_seq', 1, false);


--
-- Name: qa_questionvote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.qa_questionvote_id_seq', 1, false);


--
-- Name: taxonomy_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taxonomy_category_id_seq', 89, true);


--
-- Name: taxonomy_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taxonomy_tag_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict EljhhH0LmYiqeelbID9Yjw5o99m7oEWgb44rCtrRVmxJsHc5DYi8f5xQ1MRPTDa

